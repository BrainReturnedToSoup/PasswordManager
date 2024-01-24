const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { JWT_ERROR } = require("../enums/jwtEnums.js");
const { DataError } = require("./customErrors.js");

const {
  getUserPassword,
  renewToken,
  validateDecodedToken,
  terminateSession,
  createSession,
} = require("./utils.js");

//************AUTH-USER***************/

//attempt to find the user's password given the supplied email, make the comparison
//between the found password and the supplied password, and then decides whether to create
//a session or return a rejection
async function authUser(email, password) {
  try {
    const retrievedPassword = await getUserPassword(email),
      match = await bcrypt.compare(password, retrievedPassword);

    if (!match) {
      throw new DataError(JWT_ERROR.INVALID_CREDS);
    }

    const startingToken = createSession(result.user_uuid);

    return {
      success: true,
      token: startingToken,
    };
  } catch (error) {
    console.error(`authUser catch block: ${error} ${error.stack}`);
    return authUserError(error);
  }
}

function authUserError(error) {
  if (error instanceof DataError) {
    return { success: true, error }; //use the existence of the error property on success to signal a data error
  }

  return { success: false, error };
}

//************DEAUTH-USER*************/

async function deauthUser(encodedToken) {
  try {
    terminateSession(encodedToken);
    return { success: true };
  } catch (error) {
    console.error(`deauthUser catch block: ${error} ${error.stack}`);
    return { success: false, error };
  }
}

//***********CHECK-AUTH***************/

//checks the auth validity by verifying the token itself from expiry and tampering,
//then takes the payload information and validates it. The payload should contain
//information pointing to a specific user, hence the validation against the data in
//the db.

//if auth is valid, a new token within the same session is returned for the user
//to use for the next request.
async function checkAuth(encodedToken) {
  try {
    const decodedToken = jwt.verify(encodedToken, process.env.JWT_SK), //will throw an error if tampered with or expired
      uuid = await validateDecodedToken(decodedToken), //validate payload data against session data
      newToken = renewToken(decodedToken);

    return {
      success: true,
      auth: true,
      newToken, //package a new token to be used, since each successful request corresponds to a unique token
      uuid,
    };
  } catch (error) {
    console.error(`checkAuth catch block: ${error} ${error.stack}`);
    return checkAuthError(error, encodedToken);
  }
}

function checkAuthError(error, encodedToken) {
  //expired token, JWT library error name
  if (error.name === "TokenExpiredError") {
    terminateSession(encodedToken);
    return { success: true, auth: false };
  }

  //data error means things like an invalid jti,
  //or perhaps the uuid in the token does not match a user
  if (error instanceof DataError) {
    return { success: true, error }; //use the existence of the error property on success to signal a data error
  }

  //everything else, which includes explicit process errors, other jwt errors, native errors
  return { success: false, error };
}

module.exports = {
  authUser,
  checkAuth,
  deauthUser,
};
//will be used as utilities with middleware. Entire auth system will be within it's own child process
