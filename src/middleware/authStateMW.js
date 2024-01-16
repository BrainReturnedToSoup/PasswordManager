const auth = require("../services/authProcessApis");
const censorEmail = require("../utils/censorEmail");

const { JWT_RESPONSE_TYPE } = require("../enums/jwtEnums");

//******************GET******************/

async function validateAuth(req, res) {
  //if the jwt cookie does not exist, then obviously not authenticated
  if (!req.cookies.jwt) {
    res.status(200).json({ success: true, auth: false });
    return;
  }

  //validate the token that is stored in the cookie, which involves checking
  //session validity, cryptographic operations, and comparing data that exists within
  //the token to what is within the DB
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
    res.status(500).json({ success: false });
    return;
  }

  const { type, email } = result; //can be either 'error' or 'token'

  if (type === JWT_RESPONSE_TYPE.VALID) {
    const censoredEmail = censorEmail(email);
    res.status(200).json({ success: true, auth: true, email: censoredEmail });
    return;
  }

  //if the jwt response type is an error
  res.status(200).json({ success: true, auth: false });
}

const authStateMW = [validateAuth];

module.exports = authStateMW;
