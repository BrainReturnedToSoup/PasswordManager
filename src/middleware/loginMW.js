const serveBundle = require("../utils/serveBundle");
const censorEmail = require("../utils/censorEmail");
const validateEmailAndPassword = require("../utils/validateEmailAndPassword");

const auth = require("../services/authProcessApis");

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums"),
  { JWT_RESPONSE_TYPE } = require("../enums/jwtEnums"),
  VALIDATION_RESPONSE = require("../enums/validateEmailAndPassEnums");

//******************GET******************/

const loginGetMW = [serveBundle];

//******************POST*****************/

//POST requests on the /log-in route which is for authenticating a user using
//the login form values

async function validateAuth(req, res, next) {
  if (!req.cookies.jwt) {
    next();
    return;
  }

  let result, error;

  try {
    result = await auth.checkAuth(req.cookies.jwt); //doesn't throw auth related errors, will only return flags.
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(
      "LOG-IN ERROR: validateAuth - Login POST catch block",
      error,
      error.stack
    );
    return;
  }

  //only an issue if the current JWT token in cookies is valid
  if (result.type === JWT_RESPONSE_TYPE.VALID) {
    res.status(400).json({ error: OUTBOUND_RESPONSE.ALREADY_AUTHED });
    return;
  }

  next(); //everything other than a valid JWT token in cookies allows for the processing of the auth request
}

async function tryLoginAttempt(req, res) {
  const validationResult = validateEmailAndPassword(req);

  if (validationResult === VALIDATION_RESPONSE.ERROR) {
    console.error("LOG-IN ERROR: constraint-validation-failure");
    res
      .status(400)
      .json({ error: OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE });
    return;
  }

  const { email, password } = req.body;

  let result, error;

  try {
    result = await auth.authUser(email, password); //either a token or an error of some kind will be returned
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error("LOG-IN ERROR: tryLoginAttempt ", error, error.stack);
    res.status(500);
    return;
  }

  if (result.type === JWT_RESPONSE_TYPE.ERROR) {
    console.error("LOG-IN ERROR: user-auth-failure ", result.error);
    res.status(400).json({
      error: result.error,
    });
    return;
  } //for both actual errors and invalid login info errors

  if (result.type === JWT_RESPONSE_TYPE.TOKEN) {
    const { token } = result,
      cookieOptions = {
        secure: true, //the cookie is only sent over https
        httpOnly: true, //prevents client side JS from accessing the cookie
        sameSite: "Strict", //prevents requests from different origins from using the cookie
      };

    const censoredEmail = censorEmail(email);

    res
      .status(200)
      .cookie("jwt", token, cookieOptions)
      .json({ success: true, email: censoredEmail }); //the token is stored in the users secured cookies, redirect to home
  }
}

const loginPostMW = [validateAuth, tryLoginAttempt];

//*****************EXPORTS***************/

module.exports = { loginGetMW, loginPostMW };
