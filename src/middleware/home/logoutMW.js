const auth = require("../../services/authProcessApis");

//*****************AUTH******************/

async function validateAuth(req, res, next) {
  //if the jwt cookie does not exist, then obviously not logged in
  if (!req.cookies.jwt) {
    res.status(200).json({ success: false, auth: false }); //return auth when there isn't a system error
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
    res.status(500).json({ success: false, error }); //this is for system errors, not within the auth flow logic itself
    return;
  }

  if (!result.success) {
    res.status(200).json({ ...result, auth: false }); //return auth when there isn't a system error
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

  if (!result.success) {
    res.status(500).json(result);
    return;
  }

  res.status(200).json(result);
}

const logoutPostMW = [validateAuth, attemptLogout];

module.exports = logoutPostMW;
