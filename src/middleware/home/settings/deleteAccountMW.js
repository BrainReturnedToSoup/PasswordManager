const pool = require("../../../services/postgresql.js");
const bcrypt = require("bcrypt");

const { validateAuth } = require("./_common/auth.js");
const errorResponse = require("./_common/errorResponse.js");
const { constraintValidation } = require("../../../utils/inputValidation.js");

const OUTBOUND_RESPONSE = require("../../../enums/serverResponseEnums.js");

//input/constraint validation
function validatePayload(req, res, next) {
  const { email, password } = req.body;

  const emailValid = constraintValidation.email(email),
    passwordValid = constraintValidation.password(password);

  if (!emailValid || !passwordValid) {
    console.error(
      `deleteAccountMW: validateCredentials: constraint validation failure:
         email_valid: ${emailValid} password_valid: ${passwordValid}
         email: ${email} password: ${password}`
    );

    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
    return;
  }

  next(); //everything that was supplied in the input fields match what is associated with the current session
}

//query the corresponding email and password linked to the session, which is done using the returned UUID in the auth check
async function queryStoredCreds(req, res, next) {
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
    if (connection) {
      connection.done();
    } //always release the connection as soon as possible
  }

  if (error) {
    errorResponse(req, res, 500, error);
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
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_CREDS);
    return;
  }

  try {
    const match = await bcrypt.compare(password, encryptedPassword);

    if (!match) {
      errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_CREDS);
      return;
    }
  } catch (error) {
    console.error(
      `deleteAccountMW: compareCreds catch block: ${error} ${error.stack}`
    );
    errorResponse(req, res, 500, error);
  }

  next();
}

//This deletes their login as well as all corresponding credentials stored in the DB.
//Also, don't need to clear the session, as the session depends
//on the DB information that was already cleared
async function deleteAccount(req, res) {
  const { uuid } = req.checkAuth;

  let connection, error;

  //****INSTANT-CONNECTION-TERMINATION****/
  try {
    connection = await pool.connect();

    await connection.query("BEGIN"); //ensures the query is a transaction

    await connection.query(`DELETE FROM credentials WHERE user_uuid = $1`, [
      uuid,
    ]);

    await connection.query(`DELETE FROM user_settings WHERE user_uuid = $1`, [
      uuid,
    ]);

    await connection.query(`DELETE FROM users WHERE user_uuid = $1`, [uuid]); //THIS LAST FOR REF INTEGRITY

    await connection.query("COMMIT"); //ensures the query is a transaction
  } catch (err) {
    console.error(
      `deleteAccountMW: deleteUser catch block: ${err} ${err.stack}`
    );
    error = err;
  } finally {
    if (connection) {
      connection.done();
    } //always release the connection as soon as possible
  }

  if (error) {
    errorResponse(req, res, 500, error);
    return;
  }

  res.status(200).json({ success: true });
}

const deleteAccountMW = [
  validateAuth,
  validatePayload,
  queryStoredCreds,
  compareCreds,
  deleteAccount,
];

module.exports = deleteAccountMW;
