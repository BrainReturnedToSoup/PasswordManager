const auth = require("../services/authProcessApis");

const { JWT_RESPONSE_TYPE } = require("../enums/jwtEnums");

//******************GET******************/

async function scanAuth(req, res) {
  //if the jwt cookie does not exist, then obviously not authenticated
  if (!req.cookies.jwt) {
    res.status(200).json({ auth: false });
    return;
  }

  //validate the token that is stored in the cookie, which involves checking
  //session validity, cryptographic operations, and comparing data that exists within
  //the token to what is within the DB
  let authResult;

  try {
    authResult = await auth.checkAuth(req.cookies.jwt); //doesn't throw errors, will only return flags.
  } catch (error) {
    console.error(
      "AUTH STATE VALIDATION: checkCurrentAuthState catch block",
      error,
      error.stack
    );

    res.status(200).json({ auth: false });
    return;
  }

  const { type } = authResult; //can be either 'error' or 'token'

  if (type === JWT_RESPONSE_TYPE.VALID) {
    res.status(200).json({ auth: true });
    return;
  }

  res.status(200).json({ auth: false });
}

const authStateMW = [scanAuth];

module.exports = authStateMW;
