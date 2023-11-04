const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require("util");

const pool = require("../services/postgresql.js");

function generateExpirationTime() {
  //for generating the expiration time stamp for any token that is created
  return Math.floor(Date.now() / 1000) + process.env.JWT_EXP_SECONDS;
}

async function authUser(email, password) {
  let connection, user;

  try {
    connection = await pool.connect();
    const result = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    ); //only query using the email first

    if (result.rowCount !== 1) {
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
  } catch (error) {
    return { type: "error", error, stack: error.stack };
    //will be used in middleware conditional
  } finally {
    if (connection) {
      connection.release();
      //always release the connection after attempting db actions
    }
  }

  if (user) {
    const { user_uuid } = user,
      payload = { user_uuid, exp: generateExpirationTime() };

    const token = jwt.sign(payload, process.env.JWT_SK);
    //create the webtoken using the users uuid
    //and assigns an expiration time value to such

    return { type: "token", token };
  } else {
    //middleware that uses this authentication will create
    //authentication conditionals based on whether a token
    //was returned
    return null;
  }
}

const verifyAsync = util.promisify(jwt.verify);
//makes the 'verify' method compatible with async/await

async function verifyToken(token) {
  try {
    const decoded = await verifyAsync(token, process.env.JWT_SK);

    // Check if the user exists in the database
    const connection = await pool.connect();
    const result = await connection.query(
      "SELECT COUNT(*) FROM users WHERE user_uuid = $1",
      [decoded.user_uuid]
    );

    if (result.rows[0].count !== 1) {
      throw new Error("Invalid Web Token");
    }

    return { result: true };
  } catch (error) {
    return { result: false, error: error.message };
  }
}

module.exports = { authUser, verifyToken };
//export to be used as a helper function in the middleware
//This way, middleware can behave based on the output of these functions
//as opposed to using the functions as middleware themselves
