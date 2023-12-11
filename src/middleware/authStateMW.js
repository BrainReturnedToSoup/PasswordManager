const auth = require("../utils/authProcessApis");

//******************GET******************/

async function checkCurrentAuthState(req, res) {
  //if the jwt cookie does not exist, then obviously not authenticated
  if (!req.cookies.jwt) {
    res.status(200).json({ auth: false });
    return;
  }

  //validate the token that is stored in the cookie, which involves checking
  //session validity, cryptographic operations, and comparing data that exists within
  //the token to what is within the DB
  let result;

  try {
    result = await auth.checkAuth(req.cookies.jwt); //doesn't throw errors, will only return flags.
  } catch (error) {
    console.error(
      "AUTH STATE VALIDATION: checkCurrentAuthState catch block",
      error,
      error.stack
    );
  }

  const { type } = result; //can be either 'error' or 'token'

  if (type === "error") {
    res.status(200).json({ auth: false });
    return;
  }

  res.status(200).json({ auth: true });
}

const authStateMW = [checkCurrentAuthState];

module.exports = authStateMW;
