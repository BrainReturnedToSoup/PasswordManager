const validateEmailAndPassword = require("../utils/validateEmailAndPassword");
const { authUser, checkAuth } = require("../utils/jwt");

const path = require("path");
const fs = require("fs");

const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const pool = require("../services/postgresql");

//*****************Auth******************/

async function checkAuthSignup(req, res, next) {
  let authResult;

  try {
    authResult = await checkAuth(req);
  } catch (error) {
    console.error(error, error.stack);
  }

  switch (authResult) {
    case "no-token":
      next();
      break;
    case "valid-token":
      res.status(200).redirect("/home");
      break;
    case "invalid-token":
      next();
      break;
    case "validation-error":
      res.status(500).clearCookie("jwt").json({ error: "validation-error" });
      break;
    default:
      res.status(500).json({ error: "checkAuth-signup-error" });
  }
}

//******************GET******************/

function serveLoginSignupBundle(req, res) {
  const parentDir = path.join(__dirname, ".."),
    bundlePath = path.join(
      parentDir,
      "react-bundles",
      "log-in-sign-up",
      "index.html"
    );

  //have to read the file, and then send the parsed index.html file
  //to the user, this operation is normally async
  try {
    const data = fs.readFileSync(bundlePath);

    res.setHeader("Content-Type", "text/html");
    res.send(data);
  } catch (error) {
    console.error(error, error.stack);
    res.status(500).send({ error: "bundle serving error" });
  }
}
//serves the react bundle SPA for logging in and signing up for the service
//the corresponding route will be used on the client sided routing in order to
//redirect to the corresponding sign up page

const signupGetMW = [checkAuthSignup, serveLoginSignupBundle];

//*****************POST******************/

async function trySignupAttempt(req, res, next) {
  const validationResult = validateEmailAndPassword(req);

  if (validationResult.type === "error") {
    console.error("sign-up-constraint-validation-failure");

    res.status(500).json({
      error: "constraint-validation-failure",
    });
  }

  const { email } = req.body;
  let connection, queryResult, error;

  try {
    connection = await pool.connect();
    queryResult = await connection.query(
      "SELECT COUNT(*) FROM users WHERE email = $1",
      [email]
    );
  } catch (err) {
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (error) {
    console.error("db-sign-up-connection-error", error);

    res.status(500).json({ error: "db-connection" });
  }

  console.log("queryresult", queryResult);

  if (queryResult[0].count > 0) {
    console.error("sign-up-existing-user-error");

    res.status(400).json({ error: "existing-user" });
  }

  next();
}

async function addNewUser(req, res, next) {
  const { email, password } = req.body;

  let connection, error;

  try {
    const newUUID = uuid();

    const hashedPW = bcrypt.hashSync(
      password,
      parseInt(process.env.BCRYPT_SR),
      parseInt(process.env.BCRYPT_HK)
    );

    connection = await pool.connect();
    await connection.query(
      `INSERT INTO users (user_uuid, email, pw) VALUES ($1, $2, $3)`,
      [newUUID, email, hashedPW]
    );
  } catch (err) {
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (error) {
    console.log("sign-up-add-new-user-db-connection-error", error);

    res.status(500).json({ error: "db-connection" });
  }

  next();
}

async function authAndSendToHome(req, res) {
  const { email, password } = req.body;
  const authResult = await authUser(email, password);
  //perform authentication on the users email and password
  //either a token or an error of some kind will be returned

  if (authResult.type === "error") {
    console.error("sign-up-auth-and-send-home-error");

    res.status(500).json({
      error: "user-authentication-failure",
      message: authResult.error,
    });
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

const signupPostMW = [
  checkAuthSignup,
  trySignupAttempt,
  addNewUser,
  authAndSendToHome,
];

//*****************EXPORTS***************/

module.exports = { signupGetMW, signupPostMW };
