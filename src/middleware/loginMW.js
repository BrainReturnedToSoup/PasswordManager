const validateEmailAndPassword = require("../utils/validateEmailAndPassword");
const auth = require("../utils/authProcessApis");
const serveBundle = require("../utils/serveBundle");

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums"),
  { RESPONSE } = require("../enums/jwtEnums");

//******************GET******************/

const loginGetMW = [serveBundle];

//******************POST*****************/

//POST requests on the /log-in route which is for authenticating a user using
//the login form values

async function validateAuthLoginPost(req, res, next) {
  //if the jwt cookie does not exist, then obviously not authenticated
  if (!req.cookies.jwt) {
    next();
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
      "LOG-IN ERROR: validateAuthLoginPost catch block",
      error,
      error.stack
    );
  }

  //can be either 'error' or 'token'

  if (authResult.type === RESPONSE.TYPE_ERROR) {
    console.error(`checkAuth-error`, authResult.error);

    next();
    return;
  }

  res.status(400).json({ error: OUTBOUND_RESPONSE.ALREADY_AUTHED });
}

async function tryLoginAttempt(req, res) {
  const validationResult = validateEmailAndPassword(req);

  if (validationResult === "error") {
    console.error("LOG-IN ERROR: constraint-validation-failure");

    res
      .status(400)
      .json({ error: OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE });
    return;
  }

  let authResult;

  try {
    const { email, password } = req.body;

    authResult = await auth.authUser(email, password);
    //perform authentication on the users email and password
    //either a token or an error of some kind will be returned
  } catch (error) {
    console.error(error, error.stack);
  }

  if (authResult.type === RESPONSE.TYPE_ERROR) {
    console.error("LOG-IN ERROR: user-auth-failure");

    res.status(400).json({
      error: OUTBOUND_RESPONSE.USER_AUTH_FAILURE,
    });
    return;
  } //for both actual errors and invalid login info errors

  if (authResult.type === RESPONSE.TYPE_TOKEN) {
    const { token } = authResult,
      cookieOptions = {
        secure: true, //the cookie is only sent over https
        httpOnly: true, //prevents client side JS from accessing the cookie
        sameSite: "Strict", //prevents requests from different origins from using the cookie
      };

    res
      .cookie("jwt", token, cookieOptions)
      .status(200)
      .json({ redirect: OUTBOUND_RESPONSE.REDIRECT_HOME }); //the token is stored in the users secured cookies, redirect to home
  }
}

const loginPostMW = [validateAuthLoginPost, tryLoginAttempt];

//*****************EXPORTS***************/

module.exports = { loginGetMW, loginPostMW };
