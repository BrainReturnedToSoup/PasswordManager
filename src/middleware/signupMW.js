const pool = require("../services/postgresql");
const auth = require("../services/authProcessApis");

const {
  validateEmailVal,
  validatePasswordVal,
} = require("../utils/inputValidation");

const { v4: uuid } = require("uuid");
const promisify = require("util").promisify;
const bcrypt = require("bcrypt"),
  bcryptHash = promisify(bcrypt.hash);

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//*****************POST******************/

//POST requests on the /sign-up route which is for adding a new user using
//the signup form values

async function validateAuth(req, res, next) {
  if (!req.cookies.jwt) {
    next();
    return;
  } //if there isn't a jwt cookie, then obviously not authed

  let result, error;

  try {
    result = await auth.checkAuth(req.cookies.jwt);
  } catch (err) {
    console.error(`signupMW: validateAuth catch block: ${err} ${err.stack}`);
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
      "signupMW: constraint-validation-failure: ",
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

//essentially just check if the supplied credentials pass constraint validation and
//is not linked to an existing email and thus an existing user.
async function checkExistingUser(req, res, next) {
  const { email } = req.body;

  let connection, result, error;

  //****INSTANT-CONNECTION-TERMINATION****/
  try {
    connection = await pool.connect();
    result = await connection.oneOrNone(
      "SELECT COUNT(*) FROM users WHERE email = $1",
      [email]
    );
  } catch (err) {
    console.error(
      `signupMW: checkExistingUser catch block: ${err} ${err.stack}`
    );
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } //always release the connection as soon as possible
  }

  if (error) {
    res.status(500).json({ success: false, error: OUTBOUND_RESPONSE.DB_ERROR });
    return;
  }

  if (result.count > 0) {
    console.error("signupMW: existing-user");
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
    const newUUID = uuid();
    const hashedPW = await bcryptHash(
      password,
      parseInt(process.env.BCRYPT_SR)
    );

    connection = await pool.connect();

    await connection.query(`BEGIN`); //transaction is unique to the connection instance, which is unique itself

    await connection.query(
      `INSERT INTO users (user_uuid, email, pw) VALUES ($1, $2, $3)`,
      [newUUID, email, hashedPW]
    );

    //see the DB documentation or look at the 'user_settings' table columns themselves to view the various value constraints
    await connection.query(
      `INSERT INTO user_settings (
        user_uuid,
        verified,
        font_scale,
        theme_selected,
        lazy_loading,
        session_length_minutes
      )
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [newUUID, false, 2, 1, true, 10] //default settings
    );

    await connection.query(`COMMIT`);
  } catch (err) {
    console.error(`signupMW: addNewUser catch block: ${err} ${err.stack}`);
    error = err;
  } finally {
    if (connection) {
      connection.done();
    } //always release the connection as soon as possible
  }

  if (error) {
    res.status(500).json({ success: false, error: OUTBOUND_RESPONSE.DB_ERROR });
    return;
  }

  next(); //user has been successfully added to the DB at this point
}

//if all goes well prior, then automatically create a session within the auth child process
//this should return a token to then send to the user.
async function createSession(req, res, next) {
  const { email, password } = req.body;

  let result, error;

  try {
    result = await auth.authUser(email, password);
  } catch (err) {
    console.error(`signupMW: createSession catch block: ${err} ${err.stack}`);
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
    res.status(500).json(result);
    return;
  }

  //if a data error occured, so things like invalid login creds
  if (result.success && "error" in result) {
    res
      .status(400)
      .json({ success: false, error: OUTBOUND_RESPONSE.INVALID_CREDS });
    return;
  }

  //at this stage, the result is a valid auth which includes the
  //first token of the new session created
  req.token = result.token;

  next();
}

//sending the new token to use for the next successful request
function sendToken(req, res) {
  const { token } = req; //put the auth token in cookies, and give the thumbs up to the user

  res
    .status(200)
    .cookie("jwt", token, cookieOptions) //the token is stored in the users secured cookies
    .json({ success: true });
}

const handleSignup = [
  validateAuth,
  validatePayload,
  checkExistingUser,
  addNewUser,
  createSession,
  sendToken,
];

//*****************EXPORTS***************/

module.exports = { handleSignup };
