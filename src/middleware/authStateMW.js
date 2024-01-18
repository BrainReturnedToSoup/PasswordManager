const auth = require("../services/authProcessApis");
const censorEmail = require("../utils/censorEmail");

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums");

//******************GET******************/

//validate the token that is stored in the cookie, which involves checking
//session validity, cryptographic operations, and comparing data that exists within
//the token to what is within the DB
async function validateAuth(req, res) {
  if (!req.cookies.jwt) {
    res.status(200).json({ success: true, auth: false }); //if the jwt cookie does not exist, then obviously not authenticated
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
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.VALIDATE_AUTH_FAILURE });
    return;
  }

  if (!result.success) {
    res.status(200).json({ success: true, auth: false }); //if the auth had an internal error
    return;
  }

  res
    .status(200)
    .json({ success: true, auth: true, email: censorEmail(result.email) });
}

const authStateMW = [validateAuth];

module.exports = authStateMW;
