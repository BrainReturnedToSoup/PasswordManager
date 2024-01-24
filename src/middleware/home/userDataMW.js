const auth = require("../../services/authProcessApis");
const pool = require("../../services/postgresql.js");

const censorEmail = require("../../utils/censorEmail");

const OUTBOUND_RESPONSE = require("../../enums/serverResponseEnums");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//******************GET******************/

async function validateAuth(req, res, next) {
  if (!req.cookies.jwt) {
    res.status(200).json({
      success: false,
      auth: false,
    }); //if the jwt cookie does not exist, then obviously not authenticated
    return;
  }

  let result, error;

  try {
    result = await auth.checkAuth(req.cookies.jwt); //doesn't throw errors, will only return flags.
  } catch (err) {
    console.error(`userDataMW: validateAuth catch block: ${err} ${err.stack}`);
    error = err;
  }

  //if a native error occurs in the main thread, or a process or native error occurs in the child thread
  if (error || !result.success) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.VALIDATE_AUTH_FAILURE });
    return;
  }

  //if some type of data error occurred or the session has expired
  if ((result.success && "error" in result) || !result.auth) {
    res.satus(500).json({ success: false, auth: false });
    return;
  }

  req.checkAuth = result; //pass the result to the next mw's to use

  next();
}

//for retrieving the necessary user data to make the home page work properly.
//This includes the settings corresponding to the user, as well as a set of
//credential ID's and their names which will be used in lazy loading the credentials
//when a user requests a specific set of credentials
async function queryUserData(req, res, next) {
  const { uuid } = req.checkAuth;

  let connection, result, error;

  try {
    connection = await pool.connect();

    result = await connection.query(
      `
        SELECT 
          users.email,
          user_settings.verified,
          user_settings.font_scale,
          user_settings.theme_selected,
          user_settings.lazy_loading,
          user_settings.session_length_minutes
        FROM users
        INNER JOIN user_settings
            ON users.user_uuid = user_settings.user_uuid
        WHERE users.user_uuid = $1;
    `,
      [uuid]
    );
  } catch (err) {
    console.error(
      `userDataMW: queryUserData DB catch block: ${err} ${err.stack}`
    );
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } //always release the connection as soon as possible
  }

  if (error) {
    res.status(500).json({ success: false, error });
    return;
  }

  //change the result object to censor the email within it
  result.email = censorEmail(result.email);

  req.userData = result; //save the retrieved userData object in the req to be passed to next mw

  next();
}

//send the base user data to make the home page work,
//and also include a new token to use next request
function sendUserData(req, res) {
  const { userData } = req,
    { newToken } = req.checkAuth;

  res
    .status(200)
    .cookies("jwt", newToken, cookieOptions)
    .json({ success: true, userData });
}

const getUserData = [validateAuth, queryUserData, sendUserData];

module.exports = { getUserData };
