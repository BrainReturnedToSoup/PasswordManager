const pool = require("../../../services/postgresql.js");
const promisify = require("util").promisify;
const bcrypt = require("bcrypt"),
  bcryptHash = promisify(bcrypt.hash);
const { validateAuth, clearSession } = require("../_common/auth.js");
const errorResponse = require("../_common/errorResponse.js");
const { constraintValidation } = require("../../../utils/inputValidation.js");
const OUTBOUND_RESPONSE = require("../../../enums/serverResponseEnums");

//*****SET-NEW-PASSWORD*****/

//input/constraint validation
async function validatePayload(req, res, next) {
  const { oldPassword, newPassword } = req.body;

  const oldPasswordValid = constraintValidation.password(oldPassword),
    newPasswordValid = constraintValidation.password(newPassword);

  if (!oldPasswordValid || !newPasswordValid) {
    console.error(
      `setNewPasswordMW: validatePayload: constraint-validation-failure:
       oldPassword_valid: ${oldPasswordValid} newPassword_valid: ${newPasswordValid}
       oldPassword: ${oldPassword} newPassword: ${newPassword}`
    );

    errorResponse(req, res, 500, OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE);
    return;
  }

  next();
}

//query the stored password linked to the current session
//using the UUID returned from the auth check
async function queryStoredPassword(req, res, next) {
  const { uuid } = req.checkAuth;

  let connection, result, error;

  try {
    connection = await pool.connect();

    result = await connection.oneOrNone(
      `
      SELECT pw
      FROM users
      WHERE user_uuid = $1
      `,
      [uuid]
    );
  } catch (err) {
    console.error(
      `setNewPasswordMW: queryStoredPassword catch block: ${err} ${err.stack}`
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

//ensure that the old password matches the stored
//password linked to the current session.
async function comparePasswords(req, res, next) {
  const { oldPassword } = req.body,
    { pw: encryptedPassword } = req.query;

  try {
    const match = await bcrypt.compare(oldPassword, encryptedPassword);

    if (!match) {
      errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_CREDS);
      return;
    }
  } catch (error) {
    console.error(
      `setNewPasswordMW: comparePasswords catch block: ${error} ${error.stack}`
    );
    errorResponse(req, res, 500, error);
  }

  next();
}

//hash the new password received using bcrypt and store it
//to be used in the next middlewares
async function hashNewPassword(req, res, next) {
  const { newPassword } = req.body;

  try {
    req.hashedNewPassword = await bcryptHash(
      newPassword,
      parseInt(process.env.BCRYPT_SR)
    );
  } catch (error) {
    console.error(
      `setNewPasswordMW: hashPassword catch block: ${error} ${error.stack}`
    );
    errorResponse(req, res, 500, error);
  }

  next();
}

//take the hashed new password from previously and overwrite the
//value for the password in the DB, thus changing the user's password
async function setNewPassword(req, res, next) {
  const { uuid } = req.checkAuth,
    { hashedNewPassword } = req;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(
      `
      UPDATE users 
      SET pw = $1 
      WHERE user_uuid = $2
      `,
      [hashedNewPassword, uuid]
    );
  } catch (err) {
    console.error(
      `setNewPasswordMW: setNewPassword catch block: ${err} ${err.stack}`
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

const setNewPasswordMW = [
  validateAuth,
  validatePayload,
  queryStoredPassword,
  comparePasswords,
  hashNewPassword,
  setNewPassword,
  clearSession, //clear the session to make the user to log-in again
];

module.exports = setNewPasswordMW;
