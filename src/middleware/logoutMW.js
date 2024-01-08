const auth = require("../services/authProcessApis");

const { JWT_RESPONSE_TYPE } = require("../enums/jwtEnums");

//*****************POST******************/

async function attemptLogout(req, res) {
  //if the jwt cookie does not exist, then obviously not logged in
  if (!req.cookies.jwt) {
    res.status(200).json({ auth: false });
    return;
  }

  let authResult, error;

  try {
    authResult = await auth.checkAuth(req.cookies.jwt); //doesn't throw errors, will only return flags.
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(
      "AUTH STATE VALIDATION: checkCurrentAuthState catch block",
      error,
      error.stack
    );
    res.status(500);
    return;
  }

  const { type } = authResult; //can be either 'error' or 'token'

  if (type === JWT_RESPONSE_TYPE.VALID) {
    return;
  }

  //if the jwt response type is an error
  res.status(200).json({ auth: false });
}

const logoutPostMW = [attemptLogout];

module.exports = logoutPostMW;
