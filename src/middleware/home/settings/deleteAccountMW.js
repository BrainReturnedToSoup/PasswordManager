const pool = require("../../../services/postgresql.js");

const bcrypt = require("bcrypt");

const { validateAuth } = require("./common/auth.js");

const {
  validateEmailVal,
  validatePasswordVal,
} = require("../../../utils/inputValidation.js");

const OUTBOUND_RESPONSE = require("../../../enums/serverResponseEnums.js");

//input/constraint validation
function validatePayload(req, res, next) {
  const { email, password } = req.body;

  const emailValid = validateEmailVal(email),
    passwordValid = validatePasswordVal(password);

  const valid = emailValid && passwordValid;

  if (!valid) {
    console.error(
      `deleteAccountMW: validateCredentials: constraint validation failure:
         email_valid: ${emailValid} password_valid: ${passwordValid}
         email: ${email} password: ${password}`
    );

    res.status(500).json({
      success: false,
      error: OUTBOUND_RESPONSE.INVALID_CREDS,
    });
    return;
  }

  next(); //everything that was supplied in the input fields match what is associated with the current session
}

//query the corresponding email and password linked to the session, which is
//done using the returned UUID in the auth check
async function queryStoredCredentials(req, res, next) {
  const { uuid } = req.checkAuth;

  let connection, result, error;

  //****INSTANT-CONNECTION-TERMINATION****/
  try {
    connection = await pool.connect();

    result = await connection.oneOrNone(
      `
        SELECT email, pw
        FROM users
        WHERE user_uuid = $1
      `,
      [uuid]
    );
  } catch (err) {
    console.error(`deleteAccoutMW: compareCredentials: ${err} ${err.stack}`);
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } //always release the connection as soon as possible
  }

  if (error) {
    res.status(500).json({ success: false, error });
    return;
  }

  req.queried = result;

  next();
}

//compares the supplied email and password to the corresponding email
//and password of the specific session.
async function compareCreds(req, res, next) {
  const { email: retrievedEmail, pw: encryptedPassword } = req.queried,
    { email, password } = req.body;

  if (email !== retrievedEmail) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.INVALID_CREDS });
    return;
  }

  try {
    const match = bcrypt.compare(password, encryptedPassword);

    if (!match) {
      res
        .status(500)
        .json({ success: false, error: OUTBOUND_RESPONSE.INVALID_CREDS });
      return;
    }

    next();
  } catch (error) {
    console.error(
      `deleteAccountMW: compareCreds catch block: ${error} ${error.stack}`
    );
    res.status(500).json({ success: false, error });
  }
}

//This deletes their login as well as all corresponding credentials stored in the DB.
//Also, don't need to clear the session, as the session depends
//on the DB information that was already cleared
async function deleteAccount(req, res) {
  const { email } = req.body;

  let connection, error;

  //****INSTANT-CONNECTION-TERMINATION****/
  try {
    connection = await pool.connect();

    await connection.query("BEGIN"); //ensures the query is a transaction

    const { user_uuid } = await connection.oneOrNone(
      `SELECT user_uuid FROM users WHERE email = $1`,
      [email]
    );

    await connection.query(`DELETE FROM credentials WHERE user_uuid = $1`, [
      user_uuid,
    ]);
    await connection.query(`DELETE FROM user_settings WHERE user_uuid = $1`, [
      user_uuid,
    ]);
    await connection.query(`DELETE FROM users WHERE user_uuid = $1`, [
      user_uuid,
    ]); //THIS LAST FOR REF INTEGRITY

    await connection.query("COMMIT"); //ensures the query is a transaction
  } catch (err) {
    console.error(
      `deleteAccountMW: deleteUser catch block: ${err} ${err.stack}`
    );
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } //always release the connection as soon as possible
  }

  if (error) {
    res.status(500).json({ success: false, error });
    return;
  }

  res.status(200).json({ success: true });
}

const deleteAccountMW = [
  validateAuth,
  validatePayload,
  queryStoredCredentials,
  compareCreds,
  deleteAccount,
];

module.exports = deleteAccountMW;
