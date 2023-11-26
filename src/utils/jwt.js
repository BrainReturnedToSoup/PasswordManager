require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const pool = require("../services/postgresql.js");

function generateExpirationTime() {
  //for generating the expiration time stamp for any token that is created
  //define the number of seconds each token should be given
  return Math.floor(Date.now() / 1000) + process.env.JWT_EXP_SECONDS;
}

async function authUser(email, password) {
  let connection, user, authError;

  try {
    connection = await pool.connect();
    const result = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    ); //only query using the email first

    if (result.rows.length !== 1) {
      throw new Error("invalid-credentials");
    } //handled by the catch block

    const fetchedUser = result.rows[0];
    const match = await bcrypt.compare(password, fetchedUser.pw); //make password comparison

    if (match) {
      user = fetchedUser;
      //if a password match, set the outer scope 'user' variable
      //equal to the fetched user
    } else {
      throw new Error("invalid-credentials");
    }
  } catch (err) {
    authError = err;
    //will be used in middleware conditional
  } finally {
    if (connection) {
      connection.release();
      //always release the connection after attempting db actions
    }
  }

  if (authError) {
    return authError;
  }

  if (user) {
    const { user_uuid } = user,
      payload = { user_uuid, exp: generateExpirationTime() };

    const token = jwt.sign(payload, process.env.JWT_SK);
    //create the webtoken using the users uuid
    //and assigns an expiration time value to such

    return { type: "token", token };
  }
}

const checkAuth = async (req) => {
  //used to turn the passport authentication into a utility function
  //rather than a middleware declaration

  if (!req.cookies.jwt) {
    return "no-token";
  }

  let decodedToken, decodingError;
  try {
    decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SK);
  } catch (err) {
    decodingError = err;
  }

  if (decodingError) {
    return "invalid-token";
  }

  const { validationError } = await validateDecodedToken(decodedToken);

  if (validationError === "user-not-found") {
    return "invalid-token";
  }

  if (validationError) {
    return "validation-error";
  }

  return "valid-token";
};

async function validateDecodedToken(jwtToken) {
  let connection, user, validationError;
  //in order to handle connection release in a straightforward manner before
  //returning the values

  try {
    connection = await pool.connect();
    const result = await connection.query(
      `SELECT * FROM users WHERE user_uuid = $1`,
      [jwtToken.user_uuid]
    );

    if (result.rowCount !== 1) {
      throw new Error("user-not-found");
      //handled by the catch block
    }
  } catch (err) {
    validationError = err;
  } finally {
    if (connection) {
      connection.release();
    }
  }

  return { user, validationError };
}

module.exports = { authUser, checkAuth };
//export to be used as a helper function in the middleware
//This way, middleware can behave based on the output of these functions
//as opposed to using the functions as middleware themselves
