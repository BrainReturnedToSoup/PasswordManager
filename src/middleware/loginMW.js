const auth = require("../services/authProcessApis");

const {
  validateEmailVal,
  validatePasswordVal,
} = require("../utils/inputValidation");

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//******************POST*****************/

//POST requests on the /log-in route which is for authenticating a user using
//the login form values

async function validateAuth(req, res, next) {
  if (!req.cookies.jwt) {
    next();
    return;
  } //if there isn't a jwt cookie, then obviously not authed

  let result, error;

  try {
    result = await auth.checkAuth(req.cookies.jwt);
  } catch (err) {
    console.error(`loginMW: validateAuth catch block: ${err} ${err.stack}`);
    error = err;
  }

  //native error in the main thread, or process error within the child thread
  if (error || !result.success) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.VALIDATE_AUTH_FAILURE });
    return;
  }

  if (result.success) {
    //if user is not authed due to expired token or if a data error occurred
    if (("auth" in result && !result.auth) || "error" in result) {
      next();
      return;
    }

    //everything else means the user is already authed, continue the auth cycle with new token
    res.status(400).cookie("jwt", result.newToken, cookieOptions).json({
      success: false,
      auth: true,
    });
    return;
  }

  next();
}

//input/constraint validation
function validatePayload(req, res, next) {
  const validEmail = validateEmailVal(req.body.email),
    validPassword = validatePasswordVal(req.body.password);

  const valid = validEmail && validPassword;

  if (!valid) {
    console.error(
      "loginMW: constraint-validation-failure: ",
      `email: ${validEmail} `,
      `password: ${validPassword}`
    );

    res.status(500).json({
      success: false,
      error: OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE,
    });
    return;
  }

  next();
}

//if all goes well prior, then automatically create a session within the auth child process
//this should return a token to then send to the user.
async function createSession(req, res, next) {
  const { email, password } = req.body;

  let result, error;

  try {
    result = await auth.authUser(email, password);
  } catch (err) {
    console.error(`loginMW: createSession catch block: ${err} ${err.stack}`);
    error = err;
  }

  if (error) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.USER_AUTH_FAILURE });
    return;
  }

  //for process and native errors on the child process side
  if (!result.success) {
    res.status(500).json(result); //contains { success: false, error }
    return;
  }

  //if a data error occured, so things like invalid login creds
  if (result.success && "error" in result) {
    res
      .status(400)
      .json({ success: false, error: OUTBOUND_RESPONSE.INVALID_CREDS });
    return;
  }

  //at this stage, the result is a valid auth which includes the first token of the session
  req.token = result.token;

  next();
}

//sending the new token to use for the next successful request
async function sendToken(req, res) {
  const { token } = req; //put the auth token in cookies, and give the thumbs up to the user

  res.status(200).cookie("jwt", token, cookieOptions).json({ success: true }); //the token is stored in the users secured cookies, redirect to home
}

const handleLogin = [validateAuth, validatePayload, createSession, sendToken];

//*****************EXPORTS***************/

module.exports = { handleLogin };
