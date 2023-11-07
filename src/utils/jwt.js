const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("./passport.js");

const pool = require("../services/postgresql.js");

function generateExpirationTime() {
  //for generating the expiration time stamp for any token that is created
  return Math.floor(Date.now() / 1000) + process.env.JWT_EXP_SECONDS;
}

async function authUser(email, password) {
  let connection, user, error;

  try {
    connection = await pool.connect();
    const result = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    ); //only query using the email first

    if (result.rows.length !== 1) {
      throw new Error("Invalid Credentials");
      //handled by the catch block
    }

    const fetchedUser = result.rows[0];
    const match = bcrypt.compare(password, fetchedUser.pw); //make password comparison

    if (match) {
      user = fetchedUser;
      //if a password match, set the outer scope 'user' variable
      //equal to the fetched user
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    error = { type: "error", error: err, stack: err.stack };
    //will be used in middleware conditional
  } finally {
    if (connection) {
      connection.release();
      //always release the connection after attempting db actions
    }
  }

  if (error) {
    return error;
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

const checkAuth = (req) => {
  passport.authenticate("jwt", (error, validToken) => {
    if (validToken) {
      return { result: "valid" };
    } else if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return { result: "invalid" };
    } else {
      return { result: "error" };
    }
  })(req);
};

module.exports = { authUser, checkAuth };
//export to be used as a helper function in the middleware
//This way, middleware can behave based on the output of these functions
//as opposed to using the functions as middleware themselves
