const { promisify } = require("util"),
  { v4: uuid } = require("uuid"),
  bcrypt = require("bcrypt"),
  bcryptHash = promisify(bcrypt.hash);

const auth = require("../utils/authProcessApis"),
  validateEmailAndPassword = require("../utils/validateEmailAndPassword"),
  serveBundle = require("../utils/serveBundle");

const pool = require("../services/postgresql");

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums"),
  { RESPONSE } = require("../enums/jwtEnums");

//******************GET******************/

const signupGetMW = [serveBundle];

//*****************POST******************/

//POST requests on the /sign-up route which is for adding a new user using
//the signup form values

async function validateAuthSignupPost(req, res, next) {
  if (!req.cookies.jwt) {
    //if the jwt cookie does not exist, then obviously not authenticated

    next();
    return;
  }

  //validate the token that is stored in the cookie, which involves checking
  //session validity, cryptographic operations, and comparing data that exists within
  //the token to what is within the DB
  let checkResult;

  try {
    checkResult = await auth.checkAuth(req.cookies.jwt); //doesn't throw errors, will only return flags.
  } catch (error) {
    console.error(
      "SIGN-UP ERROR: validateAuthSignupPost catch block",
      error,
      error.stack
    );
  }

  //can be either 'error' or 'token'
  if (checkResult.type === RESPONSE.TYPE_ERROR) {
    console.error(`checkAuth-error`, checkResult.error);

    next();
    return;
  }

  res.status(400).json({ error: OUTBOUND_RESPONSE.ALREADY_AUTHED });
}

async function trySignupAttempt(req, res, next) {
  const validationResult = validateEmailAndPassword(req);

  if (validationResult === "error") {
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
    return; //ensures the middleware stops here
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
    const hashedPW = await bcryptHash(password, process.env.BCRYPT_SR);

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

    res.status(500).json({ error: OUTBOUND_RESPONSE.DB_ERROR });
    return;
  }

  next();
}

async function authAndSendToHome(req, res) {
  const { email, password } = req.body;

  let authResult;

  try {
    authResult = await auth.authUser(email, password);
  } catch (error) {
    console.error(
      "SIGN-UP ERROR: authAndSendToHome catch block",
      error,
      error.stack
    );
  }

  if (authResult.type === RESPONSE.TYPE_ERROR) {
    console.error("SIGN-UP ERROR: auth-and-send-home");

    res.status(500).json({
      error: OUTBOUND_RESPONSE.USER_AUTH_FAILURE,
    });
    return;
  }

  if (authResult.type === RESPONSE.TYPE_TOKEN) {
    const { token } = authResult,
      cookieOptions = {
        secure: true, //the cookie is only sent over https
        httpOnly: true, //prevents client side JS from accessing the cookie
        sameSite: "Strict", //prevents requests from different origins from using the cookie
      };

    res
      .status(200)
      .cookie("jwt", token, cookieOptions) //the token is stored in the users secured cookies
      .json({ redirect: OUTBOUND_RESPONSE.REDIRECT_HOME });
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
