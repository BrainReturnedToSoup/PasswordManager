const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { v4: uuid } = require("uuid");

const pool = require("../services/postgresql.js");

const {
  encryptData,
  decryptData,
  TokenSessionManager,
} = require("./tokenCrypto.js");

const { JWT_ERROR, JWT_RESPONSE_TYPE } = require("../enums/jwtEnums.js");

//for managing 'sessions' via established JTI-IV relationships. This is important
//for remembering which IV is used for decrypting a specific token, even if the JTI
//is constantly changing. The JTI is changed per successful request with a specific token.
const tokenSessionManager = new TokenSessionManager();

//for generating the expiration time stamp for any token that is created
//define the number of seconds each token should be given
function generateExpirationTime() {
  const oneSecondFromMS = 1000;

  return (
    Math.floor(Date.now() / oneSecondFromMS) +
    parseInt(process.env.JWT_EXP_SECONDS)
  );
}

async function authUser(email, password) {
  let connection, user, error;

  //attempt to find the user associated with the supplied email first
  //This try-catch is designed in this way in order to terminate the DB
  //connection pool as soon as possible as per required for the auth logic
  try {
    connection = await pool.connect();

    const result = await connection.oneOrNone(
      `SELECT pw, user_uuid FROM users WHERE email = $1`,
      [email]
    );

    //ensure the comparison is only made when the query result returns a valid number of users
    if (result) {
      const match = await bcrypt.compare(password, result.pw);

      if (!match) {
        error = JWT_ERROR.INVALID_CREDS;
      } else {
        user = result;
      }
    } else {
      error = JWT_ERROR.INVALID_CREDS;
    }
  } catch (err) {
    error = err;
  } finally {
    //always release the connection as soon as possible
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (error) {
    console.error(`authUser catch block: `, error, error.stack);
    return { type: JWT_RESPONSE_TYPE.ERROR, error };
  }

  if (user) {
    const { user_uuid } = user;

    const startingJti = uuid(), //JTI for new token to be made
      { encryptedString: encryptedUUID, newHexIV } = encryptData(user_uuid);

    //create a new session for the corresponding user, which this is managed via
    //an IV that stays the same for the encrypted user_uuid property data within the payload,
    //which the JTI is meant to be changed every time a successful response is made with
    //a valid token.
    const newSession = tokenSessionManager.createSession(startingJti, newHexIV);

    if (!newSession) {
      console.error(`authUser catch block: session creation failure`);
      return {
        type: JWT_RESPONSE_TYPE.ERROR,
        error: JWT_ERROR.SESSION_CREATION_FAILURE,
      };
    }

    //encrypted using AES256, which the corresponding IV for this specific 'session' is
    //saved and linked to the JTI that is saved in the token. This way, when a request is made
    //with the token, it's easy to decrypt the encrypted user UUID, and make the necessary JTI updates
    const payload = {
      user_uuid: encryptedUUID,
      exp: generateExpirationTime(),
      jti: startingJti,
    };

    const token = jwt.sign(payload, process.env.JWT_SK);

    return { type: JWT_RESPONSE_TYPE.TOKEN, token };
  }
}

async function deauthUser(encodedToken) {
  let decodedToken, error;

  //a valid token will not throw any errors, but instances of an invalid
  //token, be it tampered or expired, will throw an error even if they are
  //not 'true errors'
  try {
    decodedToken = jwt.verify(encodedToken, process.env.JWT_SK);
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(`deauthUser catch block: `, error, error.stack);
    return { type: JWT_RESPONSE_TYPE.ERROR, error: JWT_ERROR.INVALID_TOKEN };
  }

  const validationResult = await validateDecodedToken(decodedToken);

  if (validationResult.type === JWT_RESPONSE_TYPE.ERROR) {
    return { type: JWT_RESPONSE_TYPE.ERROR, error: JWT_ERROR.INVALID_TOKEN };
  }

  //at this point this token is a completely valid token, thus you can terminate
  //its session without issue
  const { jti } = decodedToken,
    success = tokenSessionManager.terminateSession(jti);

  if (!success) {
    console.error(`authUser catch block: session termination failure`);
    return {
      type: JWT_RESPONSE_TYPE.ERROR,
      error: JWT_ERROR.SESSION_TERMINATION_FAILURE,
    };
  }

  return { type: JWT_RESPONSE_TYPE.VALID };
}

async function checkAuth(encodedToken) {
  //receives a requests 'cookies' property, which is where the JWT token
  //is managed from on the client side.

  let decodedToken, error;

  //a valid token will not throw any errors, but instances of an invalid
  //token, be it tampered or expired, will throw an error even if they are
  //not 'true errors'
  try {
    decodedToken = jwt.verify(encodedToken, process.env.JWT_SK);
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(`checkAuth catch block: `, error, error.stack);
    return { type: JWT_RESPONSE_TYPE.ERROR, error: JWT_ERROR.INVALID_TOKEN };
  }

  const validationResult = await validateDecodedToken(decodedToken);

  if (validationResult.type === JWT_RESPONSE_TYPE.ERROR) {
    console.error(`checkAuth catch block: jwt response type equals error`);

    const { error } = validationResult;

    return error === JWT_ERROR.USER_NOT_FOUND
      ? { type: JWT_RESPONSE_TYPE.ERROR, error: JWT_ERROR.INVALID_TOKEN }
      : { type: JWT_RESPONSE_TYPE.ERROR, error: JWT_ERROR.VALIDATION_ERROR };
  }

  return {
    type: JWT_RESPONSE_TYPE.VALID,
    decodedToken,
    email: validationResult.email, //include the email for auth email value on the client
  };
}

//decrypt the user UUID using the combination of the JTI stored on the token
//and the token session manager instance defined previously,
//which then defines which IV to use to attempt the decryption
async function validateDecodedToken(decodedToken) {
  const { user_uuid: encryptedUserUUID, jti } = decodedToken;

  if (!tokenSessionManager.hasJti(jti)) {
    return { type: JWT_RESPONSE_TYPE.ERROR, error: JWT_ERROR.INVALID_JTI };
  }

  const decryptedUserUUID = decryptData(
    tokenSessionManager,
    encryptedUserUUID,
    jti
  );

  let email, connection, error;

  try {
    connection = await pool.connect();

    const result = await connection.oneOrNone(
      `SELECT email FROM users WHERE user_uuid = $1`,
      [decryptedUserUUID]
    );

    if (result) {
      email = result.email;
    } else {
      error = JWT_ERROR.USER_NOT_FOUND;
    }
  } catch (err) {
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (error) {
    return { type: JWT_RESPONSE_TYPE.ERROR, error };
  }

  return { type: JWT_RESPONSE_TYPE.VALID, email };
}

//will use the decoded token otherwise returned from checkAuth mainly
function renewToken(decodedToken) {
  const { user_uuid: encryptedUserUUID, jti } = decodedToken;

  //basically checking if the associated session for the token exists
  //and thus still valid
  if (!tokenSessionManager.hasJti(jti)) {
    return { type: JWT_RESPONSE_TYPE.ERROR, error: JWT_ERROR.INVALID_JTI };
  }

  const jtiNew = uuid(),
    payload = {
      user_uuid: encryptedUserUUID,
      exp: generateExpirationTime(),
      jti: jtiNew,
    };

  //create an entirely new token using the same encrypted user_uuid value
  //but with a new jti. This jti is updated in the session manager to the corres IV
  const newToken = jwt.sign(payload, process.env.JWT_SK),
    result = tokenSessionManager.updateExistingJti(jti, jtiNew);

  if (!result) {
    console.error(`renewToken catch block: failed to update existing jti`);
    return {
      type: JWT_RESPONSE_TYPE.ERROR,
      error: JWT_ERROR.JTI_UPDATE_FAILURE,
    };
  }
  //just in case due to some async execution order that the IV is not present
  //at this stage for the same reason as previously

  return { type: JWT_RESPONSE_TYPE.TOKEN, newToken };
}

module.exports = { authUser, checkAuth, renewToken, deauthUser };
//will be used as utilities with middleware. Entire auth system will be within it's own child process
