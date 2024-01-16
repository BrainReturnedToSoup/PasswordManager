const { JWT_RESPONSE_TYPE } = require("../../enums/jwtEnums");
const auth = require("../../services/authProcessApis");

//*****************AUTH******************/

async function validateAuth(req, res, next) {
  //if the jwt cookie does not exist, then obviously not authenticated
  if (!req.cookies.jwt) {
    res.status(400).json({ success: false, auth: false });
    return;
  }

  let result, error;

  try {
    result = await auth.checkAuth(req.cookies.jwt); //doesn't throw errors, will only return flags.
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(
      "AUTH STATE VALIDATION: validateAuth - auth state POST catch block",
      error,
      error.stack
    );
    res.status(400).json({ success: false, auth: false, error });
    return;
  }

  if (result.type === JWT_RESPONSE_TYPE.ERROR) {
    res.status(400).json({ success: false, auth: false, error: result.error });
    return;
  }

  next();
}

//******************GET******************/

//the settings corresponding to the user is saved within the db, hence upon a client
//bundle being loaded the settings stored will be applied automatically to the client state
function getCurrentSettings(req, res) {}

const homeGetCurrentSettingsMW = [validateAuth, getCurrentSettings];

//*****************POST******************/

//for handling a request containing the preferences definitions for the corresponding
//user.
function handleNewPreferences(req, res) {}

const homePostNewPrefsMW = [validateAuth, handleNewPreferences];

//for handling a request containing the users credentials, even though they are already
//authed, to delete their account. This deletes their login as well as all corresponding
//credentials stored in the DB.
function handleDeleteAccount(req, res) {}

const homePostDeleteAccMW = [validateAuth, handleDeleteAccount];

//for handling a request containing the old password and new password in order to change
//the password linked to the users account. May include an email verification code as well
//to prevent account hijacking.
function handleNewPassword(req, res) {}

const homePostNewPasswordMW = [validateAuth, handleNewPassword];

//for handling the verification of the email associated with an account, which this verification
//enables the user to use the application to its fullest extent. This opens up the ability to change
//preferences and store more than 5 credentials at a time.
function handleVerifyEmail(req, res) {}

const homePostVerifyEmailMW = [validateAuth, handleVerifyEmail];

module.exports = {
  homeGetCurrentSettingsMW,
  homePostNewPrefsMW,
  homePostDeleteAccMW,
  homePostNewPasswordMW,
  homePostVerifyEmailMW,
};
