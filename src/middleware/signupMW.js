const serveBundle = require("../utils/serveBundle"),
  validateEmailAndPassword = require("../utils/validateEmailAndPassword");

const pool = require("../services/postgresql");

const { promisify } = require("util"),
  { v4: uuid } = require("uuid");

const bcrypt = require("bcrypt"),
  bcryptHash = promisify(bcrypt.hash);

const auth = require("../services/authProcessApis");

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums"),
  { JWT_RESPONSE_TYPE } = require("../enums/jwtEnums"),
  VALIDATION_RESPONSE = require("../enums/validateEmailAndPassEnums");
const censorEmail = require("../utils/censorEmail");

//******************GET******************/

const signupGetMW = [serveBundle];

//*****************POST******************/

//POST requests on the /sign-up route which is for adding a new user using
//the signup form values

async function scanAuthSignupPost(req, res, next) {
  //if the jwt cookie exists, make sure that it's not already linked to
  //an authenticated session.
  if (req.cookies.jwt) {
    let checkAuthResult, error;

    try {
      checkAuthResult = await auth.checkAuth(req.cookies.jwt); //doesn't throw auth related errors, will only return flags.
    } catch (err) {
      error = err;
    }

    if (error) {
      console.error(
        "SIGN-UP ERROR: validateAuthSignupPost catch block",
        error,
        error.stack
      );
      res.status(500);
      return;
    }

    //only an issue if the current JWT token in cookies is valid
    if (checkAuthResult.type === JWT_RESPONSE_TYPE.VALID) {
      res.status(400).json({ error: OUTBOUND_RESPONSE.ALREADY_AUTHED });
      return;
    }
  }

  next(); //everything other than a valid JWT token in cookies allows for the processing of the auth request
}

async function trySignupAttempt(req, res, next) {
  const validationResult = validateEmailAndPassword(req);

  if (validationResult === VALIDATION_RESPONSE.ERROR) {
    console.error("SIGN-UP ERROR: constraint-validation-failure");
    res.status(500).json({
      error: OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE,
    });
    return;
  }

  let connection, numOfUsers, error;

  try {
    const { email } = req.body;

    connection = await pool.connect();
    numOfUsers = await connection.query(
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
    console.error("SIGN UP ERROR: db-sign-up-error", error);
    res.status(500).json({ error: OUTBOUND_RESPONSE.DB_ERROR });
    return;
  }

  //then check for whether the previous query returned a
  //value greater than 0 which means there is an existing user
  //with the supplied email
  if (numOfUsers[0].count > 0) {
    console.error("SIGN-UP ERROR: existing-user");
    res.status(400).json({ error: OUTBOUND_RESPONSE.EXISTING_USER });
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
    res.status(500).json({ error: OUTBOUND_RESPONSE.DB_ERROR });
    return;
  }

  next();
}

async function applyNewAuthStatus(req, res) {
  const { email, password } = req.body;

  let authResult, error;

  try {
    authResult = await auth.authUser(email, password);
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(
      "SIGN-UP ERROR: applyNewAuthStatus catch block",
      error,
      error.stack
    );
    res.status(500);
    return;
  }

  if (authResult.type === JWT_RESPONSE_TYPE.ERROR) {
    console.error("SIGN-UP ERROR: apply-new-auth-status", authResult.type);
    res.status(500).json({
      error: OUTBOUND_RESPONSE.USER_AUTH_FAILURE,
    });
    return;
  }

  if (authResult.type === JWT_RESPONSE_TYPE.TOKEN) {
    const { token } = authResult,
      cookieOptions = {
        secure: true, //the cookie is only sent over https
        httpOnly: true, //prevents client side JS from accessing the cookie
        sameSite: "Strict", //prevents requests from different origins from using the cookie
      };

    const censoredEmail = censorEmail(email);

    res
      .status(200)
      .cookie("jwt", token, cookieOptions) //the token is stored in the users secured cookies
      .json({ auth: true, email: censoredEmail });
  }
}

const signupPostMW = [
  scanAuthSignupPost,
  trySignupAttempt,
  addNewUser,
  applyNewAuthStatus,
];

//*****************EXPORTS***************/

module.exports = { signupGetMW, signupPostMW };
