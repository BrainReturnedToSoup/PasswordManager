const pool = require("../../../services/postgresql.js");
const bcrypt = require("bcrypt");

const { validateAuth, clearSession } = require("./common/auth.js");
const { errorResponse } = require("./common/errorResponse.js");

const {
  validateEmailVal,
  validatePasswordVal,
} = require("../../../utils/inputValidation.js");

const OUTBOUND_RESPONSE = require("../../../enums/serverResponseEnums");

//*****SET-NEW*EMAIL********/

//input/constraint validation
function validatePayload(req, res, next) {
  const { oldEmail, password, newEmail } = req.body;

  const validEmail = validateEmailVal(oldEmail),
    validPassword = validatePasswordVal(password),
    validNewEmail = validateEmailVal(newEmail);

  const valid = validEmail && validPassword && validNewEmail;

  if (!valid) {
    console.error(
      `setNewEmailMW: validatePayloadNewEmail:
       email_valid: ${validEmail} password_valid: ${validPassword}
       email: ${oldEmail} password: ${password}`
    );

    errorResponse(req, res, 500, OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE);
    return;
  }

  next();
}

//query for the corresponding email and password that is already stored
//using the UUID returned from the auth check
async function queryStoredCredentials(req, res, next) {
  const { uuid } = req.checkAuth;

  let connection, result, error;

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
    console.error(
      `setNewEmailMW: queryStoerdCredentials catch block: ${err} ${err.stack}`
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

  req.query = result;

  next();
}

//make the comparison between the stored credentials and the credentials in the req body
async function compareCredentials(req, res, next) {
  const { oldEmail, password } = req.body,
    { email, pw: encryptedPassword } = req.query;

  if (oldEmail !== email) {
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
      `setNewEmailMW: compareCredentials catch block: ${error} ${error.stack}`
    );
    errorResponse(req, res, 500, error);
  }

  next();
}

//update the db to have the new email instead, and also
//set the verified flag to false, as the user will have to
//reverify via the new email
async function setNewEmail(req, res, next) {
  const { newEmail } = req.body,
    { uuid } = req.checkAuth;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(`BEGIN`);

    await connection.query(`UPDATE users SET email = $1 WHERE user_uuid = $2`, [
      newEmail,
      uuid,
    ]);

    await connection.query(
      `UPDATE user_settings SET verified = $1 WHERE user_uuid = $2`,
      [false, uuid]
    );

    await connection.query(`COMMIT`);
  } catch (err) {
    console.error(
      `setNewEmailMW: setNewEmail catch block: ${err} ${err.stack}`
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

  next();
}

const setNewEmailMW = [
  validateAuth,
  validatePayload,
  queryStoredCredentials,
  compareCredentials,
  setNewEmail,
  clearSession,
];

module.exports = setNewEmailMW;
