const auth = require("../../services/authProcessApis");
const pool = require("../../services/postgresql.js");

const {
  validateEmailVal,
  validatePasswordVal,
  validateSettingsObj,
} = require("../../utils/inputValidation.js");

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
    });
    return;
  } //if the jwt cookie does not exist, then obviously not authenticated

  let result, error;

  try {
    result = await auth.checkAuth(req.cookies.jwt);
  } catch (err) {
    console.error(
      `settings common MW: validateAuth catch block: ${err} ${err.stack}`
    );
    error = err;
  }

  //native error in the main thread, or native or process error within the child thread
  if (error || !result.success) {
    res
      .status(400)
      .json({ success: false, error: OUTBOUND_RESPONSE.VALIDATE_AUTH_FAILURE });
    return;
  }

  //if some type of data error occurred or the session has expired
  if (result.success && "error" in result) {
    res.satus(500).json({ success: false, auth: false });
    return;
  }

  req.checkAuth = result; //pass the result to the next mw's to use

  next();
}

//clears the session linked to the request, which is important for things such
//as account deletion and new passwords.
async function clearSession(req, res) {
  let result, error;

  try {
    result = await auth.deauthUser(req.cookies.jwt); //returns an object following the 'success' pattern
  } catch (err) {
    console.error(
      `updateSettingsMW: clearSession catch block: ${err} ${err.stack}`
    );
    error = err;
  }

  if (error) {
    res.status(500).json({ success: false, error });
    return;
  }

  if (!result.success) {
    res.status(500).json(result);
    return;
  }

  res.status(200).json(result); //result is just { success: true }
}

//*****************POST******************/

//******UPDATE-SETTINGS*****/

//input/constraint validation
function validatePayloadUpdateSettings(req, res, next) {
  const valid = validateSettingsObj(req.body);

  //if one of the input properties is not of a valid value
  if (!valid) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.INVALID_VALUE });
    return;
  }

  next();
}

//for handling a request containing the most up to date rendition of user settings, which is sent when
//the user makes a change to any portion of the settings that relies on state.
async function updateSettings(req, res) {
  const {
    verified,
    fontScale,
    themeSelected,
    lazyLoading,
    sessionLengthMinutes,
  } = req.body;

  const { uuid } = req.checkAuth;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(
      `UPDATE user_settings 
       SET verified = $1,
        font_scale = $2,
        theme_selected = $3,
        lazy_loading = $4,
        session_length_minutes = $5
       WHERE user_uuid = $6`,
      [
        verified,
        fontScale,
        themeSelected,
        lazyLoading,
        sessionLengthMinutes,
        uuid,
      ]
    );
  } catch (err) {
    console.error(
      `updateSettingsMW: updateSettings catch block: ${err} ${err.stack}`
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

const homePostNewPrefsMW = [
  validateAuth,
  validatePayloadUpdateSettings,
  updateSettings,
];

//********DELETE-USER*******/

//make sure the supplied email and password are valid inputs, not comparing them
//to what is in the DB just yet.
//input validation
function validatePayloadDeleteUser(req, res, next) {
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
      error: OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE,
    });
    return;
  }

  next(); //everything that was supplied in the input fields match what is associated with the current session
}

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
async function deleteUser(req, res) {
  const { email } = req.body;

  let connection, error;

  //****INSTANT-CONNECTION-TERMINATION****/
  try {
    connection = await pool.connect();

    await connection.query("BEGIN"); //ensures the query is a transaction

    const result = await connection.oneOrNone(
      `SELECT user_uuid FROM users WHERE email = $1`,
      [email]
    );

    await connection.query(`DELETE FROM credentials WHERE user_uuid = $1`, [
      result.user_uuid,
    ]);
    await connection.query(`DELETE FROM users WHERE user_uuid = $1`, [
      result.user_uuid,
    ]);
    await connection.query(`DELETE FROM user_settings WHERE user_uuid = $1`, [
      result.user_uuid,
    ]);

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

const homePostDeleteAccMW = [
  validateAuth,
  validatePayloadDeleteUser,
  queryStoredCreds,
  compareCreds,
  deleteUser,
];

//*****SET-NEW-PASSWORD*****/

//input/constraint validation
async function validatePayloadNewPassword(req, res, next) {
  const { newPassword } = req.body;

  const valid = validatePasswordVal(newPassword);

  if (!valid) {
    console.error("NEW-PASSWORD ERROR: constraint-validation-failure");
    res.status(500).json({
      success: false,
      error: OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE,
    });
    return;
  }

  next();
}

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
      `newPasswordMW: queryStoredPassword catch block: ${err} ${err.stack}`
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

  req.query = result;

  next();
}

async function comparePasswords(req, res, next) {
  const { oldPassword } = req.body,
    { pw: encryptedPassword } = req.query;

  let match, error;

  try {
    match = await bcrypt.compare(oldPassword, encryptedPassword);
  } catch (err) {
    console.error(
      `newPasswordMW: comparePasswords catch block: ${err} ${err.stack}`
    );
    error = err;
  }

  if (error) {
    res.status(500).json({ success: false, error });
    return;
  }

  if (!match) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.INVALID_CREDS });
    return;
  }

  next();
}

//for handling a request containing the old password and new password in order to change
//the password linked to the users account. May include an email verification code as well
//to prevent account hijacking.

async function hashNewPassword(req, res, next) {
  const { newPassword } = req.body;

  try {
    req.hashedNewPassword = await bcryptHash(
      newPassword,
      parseInt(process.env.BCRYPT_SR)
    );

    next();
  } catch (error) {
    console.error(
      `newPasswordMW: hashPassword catch block: ${error} ${error.stack}`
    );
    res.status(500).json({ success: false, error });
  }
}

async function setNewPassword(req, res, next) {
  const { uuid } = req.checkAuth,
    { hashedNewPassword } = req;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(`UPDATE users SET pw = $1 WHERE user_uuid = $2`, [
      hashedNewPassword,
      uuid,
    ]);
  } catch (err) {
    console.error(
      `newPasswordMW: setNewPassword DB catch block: ${err} ${err.stack}`
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

  next();
}

const homePostNewPasswordMW = [
  validateAuth,
  validatePayloadNewPassword,
  queryStoredPassword,
  comparePasswords,
  hashNewPassword,
  setNewPassword,
  clearSession, //have the manually clear the session forcing the user to log-in again
];

//*****SET-NEW*EMAIL********/

function validatePayloadNewEmail(req, res, next) {
  const { oldEmail, password, newEmail } = req.body;

  const validEmail = validateEmailVal(oldEmail),
    validPassword = validatePasswordVal(password),
    validNewEmail = validateEmailVal(newEmail);

  const valid = validEmail && validPassword && validNewEmail;

  if (!valid) {
    console.error(
      `newEmailMW: validatePayloadNewEmail:
       valid_email: ${validEmail} valid_password: ${validPassword}
       email: ${oldEmail} password: ${password}`
    );

    res.status(500).json({
      success: false,
      error: OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE,
    });
    return;
  }

  next();
}

async function setNewEmail(req, res, next) {
  const { newEmail, oldEmail } = req.body;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(`BEGIN`);

    const result = await connection.oneOrNone(
      `SELECT user_uuid FROM users WHERE email = $1`,
      [oldEmail]
    );

    await connection.query(`UPDATE users SET email = $1 WHERE email = $2`, [
      newEmail,
      oldEmail,
    ]);

    await connection.query(
      `UPDATE user_settings SET verified = $1 WHERE user_uuid = $2`,
      [false, result.user_uuid]
    );

    await connection.query(`COMMIT`);
  } catch (err) {
    console.error(`newEmailMW: setNewEmail catch block: ${err} ${err.stack}`);
    error = err;
  } finally {
    //always release the connection as soon as possible
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (error) {
    res.status(500).json({ success: false, error });
    return;
  }

  next();
}

const homePostNewEmailMW = [
  validateAuth,
  validatePayloadNewEmail,
  setNewEmail,
  clearSession,
];

//******VERIFY-EMAIL********/

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
  homePostNewEmailMW,
  homePostVerifyEmailMW,
};
