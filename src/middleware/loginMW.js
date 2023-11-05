const sanitizeInput = require("../utils/inputSanitizer");
const passport = require("../utils/passport");
const authUser = require("../utils/jwt");

//******************GET******************/

function serveLoginSignupBundle(req, res) {
  const bundlePath = path.join(__dirname, "react-bundles", "log-in-sign-up");

  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(bundlePath, "index.html"));
  //serves the react bundle SPA fr logging in and signing up for the service
}

const getAuth = passport.authenticate("jwt", (error, payload) => {
  if (error) {
    res.status(500).json({ message: "Internal server error." });
  }

  if (payload) {
    res.status(200).redirect("/home");
  } else {
    next();
  }
})(req, res, next);

const loginPageMW = [getAuth, serveLoginSignupBundle];

//******************POST*****************/

function tryLoginAttempt(req, res) {
  const { email, password } = sanitizeInput(req.body);

  const result = authUser(email, password);
  //perform authentication on the users email and password
  //either a token or an error of some kind will be returned

  if (result.type === "error") {
    const { error, stack } = result;

    res.status(500).json({ message: "Internal server error", error, stack });
  }

  if (result.type === "token") {
    const { token } = result;

    res.cookie("jwt", token, {
      secure: true, //the cookie is only sent over https
      httpOnly: true, //prevents client side JS from accessing the cookie
      sameSite: "Strict", //prevents requests from different origins from using the cookie
    }); //save the token in the cookies

    res.status(200).redirect("/home"); //the token is stored in the users secured cookies, redirect to home
  }
}

const postAuth = passport.authenticate("jwt", (error, payload) => {
  if (error) {
    res.status(500).json({ message: "Internal server error." });
  }

  if (payload) {
    res.status(200).redirect("/home");
    //valid token already exists, redirect to home
  } else {
    next(); //proceed to the middleware that executes the login attempt
  }
})(req, res, next);

const loginPostMW = [postAuth, tryLoginAttempt];

//*****************EXPORTS***************/

module.exports = { loginPageMW, loginPostMW };
