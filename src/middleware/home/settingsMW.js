const auth = require("../../services/authProcessApis");
const pool = require("../../services/postgresql.js");

const promisify = require("util").promisify;
const bcrypt = require("bcrypt"),
  bcryptHash = promisify(bcrypt.hash);

const OUTBOUND_RESPONSE = require("../../enums/serverResponseEnums");

//*****************AUTH******************/

//a valid auth is necessary for any settings features to work.
async function validateAuth(req, res, next) {
  if (!req.cookies.jwt) {
    res.status(400).json({
      success: false,
      auth: false,
      error: OUTBOUND_RESPONSE.NO_AUTH_COOKIE,
    });
    return;
  } //if the jwt cookie does not exist, then obviously not authenticated

  let result, error;

  try {
    result = await auth.checkAuth(req.cookies.jwt); //returns an object following the 'success' pattern
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(
      "AUTH STATE VALIDATION: validateAuth - auth state POST catch block",
      error,
      error.stack
    );
    res.status(400).json({ success: false, error }); //system error
    return;
  }

  if (!result.success) {
    res.status(400).json({ success: false, auth: false, error: result.error }); //explicit properties because the result has sensitive information
    return;
  }

  req.checkAuth = result; //put the checkAuth result in the req object to be used by the next middlewares

  next();
}

//clears the session linked to the request, which is important for things such
//as account deletion and new passwords.
async function clearSession(req, res) {
  let result, error;

  try {
    result = await auth.deauthUser(req.cookies.jwt); //returns an object following the 'success' pattern
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(`clearSession catch block: `, error, error.stack);
    res.status(500).json({ success: false, error });
    return;
  }

  if (!result.success) {
    res.status(500).json(result);
    return;
  }

  res.status(200).json(result);
}

//******************GET******************/

//the settings corresponding to the user is saved within the db, hence upon a client
//bundle being loaded the settings stored will be applied automatically to the client state
function getCurrentSettings(req, res) {}

const homeGetCurrentSettingsMW = [validateAuth, getCurrentSettings];

//*****************POST******************/

//******NEW-PREFERENCES*****/

//for handling a request containing the preferences definitions for the corresponding
//user.
function handleNewPreferences(req, res) {}

const homePostNewPrefsMW = [validateAuth, handleNewPreferences];

//********DELETE-USER*******/

//make sure the supplied email and password match the email and
//password of the account linked to the current session
async function compareCredentials(req, res, next) {
  const { email, password } = req.body,
    { email: storedEmail, encryptedPassword } = req.checkAuth;

  if (email !== storedEmail) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.USER_NOT_FOUND });
    return;
  }

  let match, error;

  try {
    match = await bcrypt.compare(password, encryptedPassword);
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(`handleDeleteAccount catch block: `, error, error.stack);
    res.status(500).json({ success: false, error });
    return;
  }

  if (!match) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.USER_NOT_FOUND });
    return;
  }

  next(); //everything that was supplied in the input fields match what is associated with the current session
}

//This deletes their login as well as all corresponding credentials stored in the DB.
async function deleteUser(req, res) {
  const { email } = req.body;

  let connection, error;

  //****INSTANT-CONNECTION-TERMINATION****/
  try {
    connection = await pool.connect();

    await connection.query("BEGIN"); //ensures the query is a transaction
    result = await connection.oneOrNone(
      `SELECT user_uuid FROM users WHERE email = $1`,
      [email]
    );

    await connection.query(`DELETE FROM credentials WHERE user_uuid = $1`, [
      result.user_uuid,
    ]);
    await connection.query(`DELETE FROM users WHERE user_uuid = $1`, [
      result.user_uuid,
    ]);
    await connection.query("COMMIT"); //ensures the query is a transaction
  } catch (err) {
    error = err;
  } finally {
    //always release the connection as soon as possible
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (error) {
    console.error(`handleDeleteAccount catch block: `, error, error.stack);
    res.status(500).json({ success: false, error });
    return;
  }

  //don't need to clear the session, as the session depends
  //on the DB information that was already cleared
  res.status(200).json({ success: true });
}

const homePostDeleteAccMW = [validateAuth, compareCredentials, deleteUser];

//*****SET-NEW*PASSWORD*****/

async function comparePasswords(req, res, next) {
  const { oldPassword } = req.body,
    { encryptedPassword } = req.checkAuth;

  let match, error;

  try {
    match = await bcrypt.compare(oldPassword, encryptedPassword);
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(`comparePasswords catch block: `, error, error.stack);
    res.status(500).json({ success: false, error });
    return;
  }

  if (!match) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.USER_NOT_FOUND });
    return;
  }

  next();
}

//for handling a request containing the old password and new password in order to change
//the password linked to the users account. May include an email verification code as well
//to prevent account hijacking.
async function setNewPassword(req, res, next) {
  const { newPassword } = req.body,
    { email } = req.checkAuth;

  //**HASH**/
  let newHashedPassword, hashError;

  try {
    newHashedPassword = await bcryptHash(
      newPassword,
      parseInt(process.env.BCRYPT_SR)
    );
  } catch (err) {
    hashError = err;
  }

  if (hashError) {
    console.error(
      `setNewPassword bcrypt catch block: `,
      hashError,
      hashError.stack
    );
    res.status(500).json({ success: false, error: hashError });
    return;
  }

  //**SAVE**/
  let connection, dbError;

  try {
    connection = await pool.connect();

    await connection.query(`UPDATE users SET pw = $1 WHERE email = $2`, [
      newHashedPassword,
      email,
    ]);
  } catch (err) {
    dbError = err;
  } finally {
    //always release the connection as soon as possible
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (dbError) {
    console.error(`setNewPassword DB catch block`);
    res.status(500).json({ success: false, error: dbError });
    return;
  }

  next();
}

const homePostNewPasswordMW = [
  validateAuth,
  comparePasswords,
  setNewPassword,
  clearSession, //have the manually clear the session forcing the user to log-in again
];

//for handling the verification of the email associated with an account, which this verification
//enables the user to use the application to its fullest extent. This opens up the ability to change
//preferences and store more than 5 credentials at a time.
function verifyEmail(req, res) {}

const homePostVerifyEmailMW = [validateAuth, verifyEmail];

module.exports = {
  homeGetCurrentSettingsMW,
  homePostNewPrefsMW,
  homePostDeleteAccMW,
  homePostNewPasswordMW,
  homePostVerifyEmailMW,
};
