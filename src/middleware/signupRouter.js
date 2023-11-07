const validateEmailAndPassword = require("../utils/validateEmailAndPassword");
const { authUser, checkAuth } = require("../utils/jwt");

const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const pool = require("../services/postgresql");

//*****************Auth******************/

function checkAuthSignup(req, res, next) {
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

const signupGetMW = [checkAuthSignup, serveLoginSignupBundle];

//*****************POST******************/

async function trySignupAttempt(req, res, next) {
  const validationResult = validateEmailAndPassword(req.body);

  if (validationResult.type === "error") {
    res
      .status(500)
      .json({ error: "cnostraint-validation", result: validationResult });
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
    if (connection) {
      connection.terminate();
    }
  }

  if (error) {
    res.status(500).json({ error: "db-connection" });
  }

  if (queryResult?.rowCount > 0) {
    res.status(400).json({ error: "user-exists" });
  }

  next();
}

async function addNewUser(req, res, next) {
  const { email, password } = req.body;

  const hashedPW = bcrypt.hash(
    password,
    process.env.BCRYPT_SR,
    process.env.BCRYPT_HK
  );

  let connection, error;

  try {
    const randomPK = uuid();

    connection = await pool.connect();
    await connection.query(
      `INSERT INTO users (user_uuid, email, pw) VALUES ($1, $2, $3)`,
      [randomPK, email, hashedPW]
    );
  } catch (err) {
    error = err;
  } finally {
    if (connection) {
      connection.release();
    }
  }

  if (error) {
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
    res.status(500).json({ error: "user-authentication" });
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
