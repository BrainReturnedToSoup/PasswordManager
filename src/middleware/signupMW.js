const validateEmailAndPassword = require("../utils/validateEmailAndPassword");
const { authUser, checkAuth } = require("../utils/jwt");
const serveBundle = require("../utils/serveBundle");

const { v4: uuid } = require("uuid");
const { promisify } = require("util");
const bcrypt = require("bcrypt"),
  bcryptHash = promisify(bcrypt.hash);

const pool = require("../services/postgresql");

//******************GET******************/

const signupGetMW = [serveBundle];

//*****************POST******************/

//POST requests on the /sign-up route which is for adding a new user using
//the signup form values

async function validateAuthSignupPost(req, res, next) {
  let checkResult;

  try {
    checkResult = await checkAuth(req);
  } catch (error) {
    console.error(
      "SIGN-UP ERROR: validateAuthSignupPost -> checkAuth",
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
      console.error("LOG-IN ERROR: validateAuthSignupPost function error");
      res.status(500).json({ error: "validateAuthSignupPost-error" });
  }
}

async function trySignupAttempt(req, res, next) {
  const validationResult = validateEmailAndPassword(req);

  if (validationResult === "error") {
    console.error("SIGN-UP ERROR: constraint-validation-failure");

    res.status(500).json({
      error: "constraint-validation-failure",
    });
    return;
  }

  let connection, queryResult, error;

  try {
    const { email } = req.body;

    connection = await pool.connect();
    queryResult = await connection.query(
      "SELECT COUNT(*) FROM users WHERE email = $1",
      [email]
    );
    //essentially just check if the supplied email
    //is linked to an existing email and thus an existing user.
  } catch (err) {
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (error) {
    console.error("SIGN UP ERROR: db-sign-up-connection-error", error);

    res.status(500).json({ error: "db-connection" });
    return; //ensures the middleware stops here
  }

  //then check for whether the previous query returned a
  //value greater than 0 which means there is an existing user
  //with the supplied email
  if (queryResult[0].count > 0) {
    console.error("SIGN-UP ERROR: existing-user");

    res.status(400).json({ error: "existing-user" });
    return; //ensures the middleware stops here
  }

  next();
}

async function addNewUser(req, res, next) {
  let connection, error;

  try {
    const { email, password } = req.body,
      newUUID = uuid(); //new user primary key in DB schema

    //uses the bcrypt.hash method that was simplified using promisify
    const hashedPW = await bcryptHash(
      password,
      parseInt(process.env.BCRYPT_SR)
    );

    if (!hashedPW) {
      throw new Error("no-hashed-password");
    }

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
    console.error("SIGN-UP ERROR: add-new-user-db-connection", error);

    res.status(500).json({ error: "db-connection" });
    return;
  }

  next();
}

async function authAndSendToHome(req, res) {
  const { email, password } = req.body;
  const authResult = await authUser(email, password);

  if (authResult.type === "error") {
    console.error("SIGN-UP ERROR: auth-and-send-home");

    res.status(500).json({
      error: "user-authentication-failure",
      message: authResult.error,
    });
    return;
  }

  if (authResult.type === "token") {
    const { token } = authResult,
      cookieOptions = {
        secure: true, //the cookie is only sent over https
        httpOnly: true, //prevents client side JS from accessing the cookie
        sameSite: "Strict", //prevents requests from different origins from using the cookie
      };

    res
      .status(200)
      .cookie("jwt", token, cookieOptions) //the token is stored in the users secured cookies
      .json({ redirect: "/home" });
  }
}

const signupPostMW = [
  validateAuthSignupPost,
  trySignupAttempt,
  addNewUser,
  authAndSendToHome,
];

//*****************EXPORTS***************/

module.exports = { signupGetMW, signupPostMW };
