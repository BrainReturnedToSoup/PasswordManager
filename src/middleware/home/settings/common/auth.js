const auth = require("../../../../services/authProcessApis");

const OUTBOUND_RESPONSE = require("../../../../enums/serverResponseEnums");

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
    res.status(500).json({ success: false, auth: false });
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
      `settings common MW: clearSession catch block: ${err} ${err.stack}`
    );
    error = err;
  }

  if (error) {
    res.status(500).json({ success: false, error });
    return;
  }

  if (!result.success) {
    res.status(500).json(result); //contains { success: false, error }
    return;
  }

  res.status(200).json(result); //contains { success: true }
}

module.exports = { validateAuth, clearSession };
