const auth = require("../../services/authProcessApis");

const OUTBOUND_RESPONSE = require("../../enums/serverResponseEnums");

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
    console.error(`logoutMW: validateAuth catch block: ${err} ${err.stack}`);
    error = err;
  }

  //native error in the main thread, or process error within the child thread
  if (error || !result.success) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.VALIDATE_AUTH_FAILURE }); //this is for system errors, not within the auth flow logic itself
    return;
  }

  if (result.success && "error" in result) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.VALIDATE_AUTH_FAILURE });
    return;
  }

  //up to this point, means the corresponding session is current, thus
  //a proceeding logout sequence can execute
  next();
}

//*****************POST******************/

async function attemptLogout(req, res) {
  let result, error;

  try {
    result = await auth.deauthUser(req.cookies.jwt);
  } catch (err) {
    console.error(`logoutMW: attemptLogout catch block: ${err} ${err.stack}`);
    error = err;
  }

  if (error) {
    res.status(200).json({ success: false, error });
    return;
  }

  if (!result.success) {
    res.status(500).json(result); //will return { success: false, error }
    return;
  }

  //clear the jwt cookie, effectively removing the key
  //to resources from the user's cookies
  res.status(200).clearCookie("jwt").json(result); //will return { success: true }
}

const handleLogoutMW = [validateAuth, attemptLogout];

module.exports = handleLogoutMW;
