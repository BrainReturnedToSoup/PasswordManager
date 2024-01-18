const pool = require("../services/postgresql");
const auth = require("../services/authProcessApis");

const serveBundle = require("../utils/serveBundle"),
  { validateEmailAndPassword } = require("../utils/constraintValidation"),
  censorEmail = require("../utils/censorEmail");

const { v4: uuid } = require("uuid");
const promisify = require("util").promisify;
const bcrypt = require("bcrypt"),
  bcryptHash = promisify(bcrypt.hash);

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums");

//******************GET******************/

const signupGetMW = [serveBundle];

//*****************POST******************/

//POST requests on the /sign-up route which is for adding a new user using
//the signup form values

async function validateAuth(req, res, next) {
  if (!req.cookies.jwt) {
    next(); //if the jwt cookie exists, make sure that it's not already linked to an authenticated session.
    return;
  }

  let result, error;

  try {
    result = await auth.checkAuth(req.cookies.jwt); //doesn't throw auth related errors, will only return flags.
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(
      "SIGN-UP ERROR: validateAuth catch block - error",
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
    return; //its an issue if the user is already authed
  }

  next(); //everything other than a valid JWT token in cookies allows for the processing of the auth request
}

//essentially just check if the supplied credentials pass constraint validation and
//is not linked to an existing email and thus an existing user.
async function trySignupAttempt(req, res, next) {
  const valid = validateEmailAndPassword(req.body.email, req.body.password);

  if (!valid) {
    console.error("SIGN-UP ERROR: constraint-validation-failure");
    res.status(500).json({
      success: false,
      error: OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE,
    });
    return;
  }

  let connection, numOfUsers, error;

  //****INSTANT-CONNECTION-TERMINATION****/
  try {
    const { email } = req.body;

    connection = await pool.connect();
    numOfUsers = await connection.query(
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
    console.error("SIGN UP ERROR: db-sign-up-error", error);
    res.status(500).json({ success: false, error: OUTBOUND_RESPONSE.DB_ERROR });
    return;
  }

  if (numOfUsers[0].count > 0) {
    console.error("SIGN-UP ERROR: existing-user");
    res
      .status(400)
      .json({ success: false, error: OUTBOUND_RESPONSE.EXISTING_USER });
    return; //A value greater than 0 on the query means a user already exists
  }

  next();
}

//adding the user to the DB, of course after the credentials have been validated first.
//This involves properly hashing their password, creating a unique UUID, and then storing
//their UUID, email, and hash password as a new record in the 'users' table
async function addNewUser(req, res, next) {
  const { email, password } = req.body;

  let connection, error;

  //****INSTANT-CONNECTION-TERMINATION****/
  try {
    const newUUID = uuid(),
      hashedPW = await bcryptHash(password, parseInt(process.env.BCRYPT_SR));

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
    console.error(`addUser catch block: `, error, error.stack);
    res.status(500).json({ success: false, error: OUTBOUND_RESPONSE.DB_ERROR });
    return;
  }

  next(); //user has been successfully added to the DB at this point
}

//if all goes well prior, then automatically create a session applying their authentication
//status. This should work because their account already exists, so the generic 'authUser' api
//should not have any problems.
async function applyNewAuthStatus(req, res) {
  const { email, password } = req.body;

  let result, error;

  try {
    result = await auth.authUser(email, password);
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(
      "SIGN-UP ERROR: applyNewAuthStatus catch block",
      error,
      error.stack
    );
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.USER_AUTH_FAILURE });
    return;
  }

  if (!result.success) {
    console.error("SIGN-UP ERROR: apply-new-auth-status", result.error);
    res.status(500).json(result); //propagate the result object to the client, which includes the error that occurred
    return;
  } //for both actual errors and invalid login info errors, but invalid login info shouldn't occur here.

  //put the auth token in cookies, and give the thumbs up to the user
  const { token } = result,
    cookieOptions = {
      secure: true, //the cookie is only sent over https
      httpOnly: true, //prevents client side JS from accessing the cookie
      sameSite: "Strict", //prevents requests from different origins from using the cookie
    };

  res
    .status(200)
    .cookie("jwt", token, cookieOptions) //the token is stored in the users secured cookies
    .json({ success: true, email: censorEmail(email) });
}

const signupPostMW = [
  validateAuth,
  trySignupAttempt,
  addNewUser,
  applyNewAuthStatus,
];

//*****************EXPORTS***************/

module.exports = { signupGetMW, signupPostMW };
