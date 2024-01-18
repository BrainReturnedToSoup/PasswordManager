const auth = require("../services/authProcessApis");

const serveBundle = require("../utils/serveBundle"),
  censorEmail = require("../utils/censorEmail");

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums");

//******************GET******************/

const loginGetMW = [serveBundle];

//******************POST*****************/

//POST requests on the /log-in route which is for authenticating a user using
//the login form values

async function validateAuth(req, res, next) {
  if (!req.cookies.jwt) {
    next();
    return; //return early, because the 'next()' api is a flag
  } //if there isn't a jwt cookie, then obviously not authed

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
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.VALIDATE_AUTH_FAILURE });
    return;
  }

  if (result.success) {
    res.status(400).json({
      success: false,
      auth: true,
      error: OUTBOUND_RESPONSE.ALREADY_AUTHED,
      email: censorEmail(result.email),
    });
    return;
  } //its an issue if the user is already authed

  next();
}

async function tryLoginAttempt(req, res) {
  const { email, password } = req.body;

  let result, error;

  try {
    result = await auth.authUser(email, password); //either a token or an error of some kind will be returned
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error("LOG-IN ERROR: tryLoginAttempt ", error, error.stack);
    res.status(500).json({ success: false, error });
    return;
  }

  if (!result.success) {
    console.error("LOG-IN ERROR: user-auth-failure ", result.error);
    res.status(400).json(result); //propagate the result object to the client, which includes the error that occurred
    return;
  } //for both actual errors and invalid login info errors

  const { token } = result,
    cookieOptions = {
      secure: true, //the cookie is only sent over https
      httpOnly: true, //prevents client side JS from accessing the cookie
      sameSite: "Strict", //prevents requests from different origins from using the cookie
    };

  res
    .status(200)
    .cookie("jwt", token, cookieOptions)
    .json({ success: true, email: censorEmail(email) }); //the token is stored in the users secured cookies, redirect to home
}

const loginPostMW = [validateAuth, tryLoginAttempt];

//*****************EXPORTS***************/

module.exports = { loginGetMW, loginPostMW };
