const validateEmailAndPassword = require("../utils/validateEmailAndPassword");
const { authUser, checkAuth } = require("../utils/jwt");
const serveBundle = require("../utils/serveBundle");

//******************GET******************/

const loginGetMW = [serveBundle];

//******************POST*****************/

//POST requests on the /log-in route which is for authenticating a user using
//the login form values

async function validateAuthLoginPost(req, res, next) {
  let checkResult;

  try {
    checkResult = await checkAuth(req);
  } catch (error) {
    console.error(
      "LOG-IN ERROR: validateAuthLoginPost -> checkAuth",
      error,
      error.stack
    );
  }

  switch (checkResult) {
    case "no-token":
      next();
      break;
    case "valid-token":
      res.status(500).json({ error: "valid-token-already-present" });
      break;
    case "invalid-token":
      next();
      break;
    case "validation-error":
      res.status(500).json({ error: "validation-error" });
      break;
    default:
      console.error("LOG-IN ERROR: validateAuthLoginPost function error");
      res.status(500).json({ error: "validateAuthLoginPost-error" });
  }
}

async function tryLoginAttempt(req, res) {
  const validationResult = validateEmailAndPassword(req);

  if (validationResult === "error") {
    console.error("LOG-IN ERROR: constraint-validation-failure");

    res.status(400).json({ error: "constraint-validation-failure" });
    return;
  }

  let authResult;

  try {
    const { email, password } = req.body;

    authResult = await authUser(email, password);
    //perform authentication on the users email and password
    //either a token or an error of some kind will be returned
  } catch (error) {
    console.error(error, error.stack);
  }

  if (authResult.type === "error") {
    console.error("LOG-IN ERROR: user-auth-failure");

    res.status(500).json({
      error: "user-auth-failure",
    });
    return;
  } //for both actual errors and invalid login info errors

  if (authResult.type === "token") {
    const { token } = authResult,
      cookieOptions = {
        secure: true, //the cookie is only sent over https
        httpOnly: true, //prevents client side JS from accessing the cookie
        sameSite: "Strict", //prevents requests from different origins from using the cookie
      };

    res
      .cookie("jwt", token, cookieOptions)
      .status(200)
      .json({ redirect: "/home" }); //the token is stored in the users secured cookies, redirect to home
  }
}

const loginPostMW = [validateAuthLoginPost, tryLoginAttempt];

//*****************EXPORTS***************/

module.exports = { loginGetMW, loginPostMW };
