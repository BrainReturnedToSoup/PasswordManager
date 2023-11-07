const validateEmailAndPassword = require("../utils/validateEmailAndPassword");
const { authUser, checkAuth } = require("../utils/jwt");

//*****************Auth******************/

function checkAuthLogin(req, res, next) {
  const { result } = checkAuth(req);

  switch (result) {
    case "valid":
      res.status(200).redirect("/home");
      break;
    case "invalid":
      next();
      break;
    case "error":
      res.status(500).json({ error: "authentication-check" });
      break;
  }
}

//******************GET******************/

function serveLoginSignupBundle(req, res) {
  const bundlePath = path.join(__dirname, "react-bundles", "log-in-sign-up");

  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(bundlePath, "index.html"));
}
//serves the react bundle SPA for logging in and signing up for the service
//the corresponding route will be used on the client sided routing in order to
//redirect to the corresponding sign up page

const loginPageMW = [checkAuthLogin, serveLoginSignupBundle];

//******************POST*****************/

async function tryLoginAttempt(req, res) {
  const validationResult = validateEmailAndPassword(req.body);

  if (validationResult.type === "error") {
    res
      .status(400)
      .json({ error: "constraint-validation", result: validationResult });
  }
  //redirect to the same page, the client side constraint validation will
  //alert the user of their issues first

  const authResult = await authUser(email, password);
  //perform authentication on the users email and password
  //either a token or an error of some kind will be returned

  if (authResult.type === "error") {
    const { error, stack } = authResult;

    res.status(500).json({ error: "user-authentication", result: error });
  }

  if (authResult.type === "token") {
    const { token } = authResult;

    res.cookie("jwt", token, {
      secure: true, //the cookie is only sent over https
      httpOnly: true, //prevents client side JS from accessing the cookie
      sameSite: "Strict", //prevents requests from different origins from using the cookie
    }); //save the token in the cookies

    res.status(200).redirect("/home"); //the token is stored in the users secured cookies, redirect to home
  }
}

const loginPostMW = [checkAuthLogin, tryLoginAttempt];

//*****************EXPORTS***************/

module.exports = { loginPageMW, loginPostMW };
