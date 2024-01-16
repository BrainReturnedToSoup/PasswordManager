const { JWT_RESPONSE_TYPE } = require("../../enums/jwtEnums");
const auth = require("../../services/authProcessApis");

//*****************AUTH******************/

async function validateAuth(req, res, next) {
  //if the jwt cookie does not exist, then obviously not logged in
  if (!req.cookies.jwt) {
    res.status(200).json({ success: true });
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
      "AUTH STATE VALIDATION: validateAuth - Logout POST catch block",
      error,
      error.stack
    );
    res.status(500).json({ success: false, error });
    return;
  }

  const { type } = result; //can be either 'error' or 'token'

  if (type === JWT_RESPONSE_TYPE.ERROR) {
    res.status(200).json({ success: false, error: result.error });
    return;
  }

  next(); //this means the current request source is a valid session that can be logged out of
}

//*****************POST******************/

async function attemptLogout(req, res) {
  let result, error;

  try {
    result = await auth.deauthUser(req.cookies.jwt);
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(
      "AUTH STATE VALIDATION: attemptLogout catch block",
      error,
      error.stack
    );
    res.status(200).json({ success: false, error });
    return;
  }

  const { type } = result;

  if (type === JWT_RESPONSE_TYPE.ERROR) {
    res.status(200).json({ success: false, error: result.error });
    return;
  }

  res.status(200).json({ success: true });
}

const logoutPostMW = [validateAuth, attemptLogout];

module.exports = logoutPostMW;
