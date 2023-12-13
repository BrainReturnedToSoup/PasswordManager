const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const pool = require("../services/postgresql.js");

const {
  encryptData,
  decryptData,
  TokenSessionManager,
} = require("./tokenCrypto.js");

const { ERROR, RESPONSE } = require("../enums/jwtEnums.js");

//for managing 'sessions' via established JTI-IV relationships. This is important
//for remembering which IV is used for decrypting a specific token, even if the JTI
//is constantly changing. The JTI is changed per successful request with a specific token.
const tokenSessionManager = new TokenSessionManager();

//for generating the expiration time stamp for any token that is created
//define the number of seconds each token should be given
function generateExpirationTime() {
  return Math.floor(Date.now() / 1000) + parseInt(process.env.JWT_EXP_SECONDS);
}

async function authUser(email, password) {
  let connection, user, authError;

  //attempt to find the user associated with the supplied email first
  //This try-catch is designed in this way in order to terminate the DB
  //connection pool as soon as possible as per required for the auth logic
  try {
    connection = await pool.connect();

    const result = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (result.length !== 1) {
      throw new Error(ERROR.INVALID_CREDS);
    }

    const fetchedUser = result[0],
      match = await bcrypt.compare(password, fetchedUser.pw);

    if (!match) {
      throw new Error(ERROR.INVALID_CREDS);
    }

    user = fetchedUser;
  } catch (err) {
    authError = err;
  } finally {
    //always release the connection as soon as possible
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (authError) {
    return { type: RESPONSE.TYPE_ERROR, error: authError };
  }

  if (user) {
    const { user_uuid } = user;

    const jtiStart = uuid(), //JTI for new token to be made
      { encryptedString: encryptedUUID, newHexIV } = encryptData(
        tokenSessionManager,
        user_uuid
      );

    //create a new session for the corresponding user, which this is managed via
    //an IV that stays the same for the encrypted user_uuid property data within the payload,
    //which the JTI is meant to be changed every time a successful response is made with
    //a valid token.
    const newSession = tokenSessionManager.createSession(jtiStart, newHexIV);

    if (!newSession.success) {
      return {
        type: RESPONSE.TYPE_ERROR,
        error: ERROR.SESSION_CREATION_FAILURE,
      };
    }

    //encrypted using AES256, which the corresponding IV for this specific 'session' is
    //saved and linked to the JTI that is saved in the token. This way, when a request is made
    //with the token, it's easy to decrypt the encrypted user UUID, and make the necessary JTI updates
    const payload = {
      user_uuid: encryptedUUID,
      exp: generateExpirationTime(),
      jti: jtiStart,
    };

    const token = jwt.sign(payload, process.env.JWT_SK);

    return { type: RESPONSE.TYPE_TOKEN, token };
  }
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
    return { type: RESPONSE.TYPE_ERROR, error: ERROR.INVALID_TOKEN };
  }

  const validationResult = await validateDecodedToken(decodedToken);

  if (validationResult.error === ERROR.USER_NOT_FOUND) {
    return { type: RESPONSE.TYPE_ERROR, error: ERROR.INVALID_TOKEN };
  }

  if (validationResult.error) {
    return { type: RESPONSE.TYPE_ERROR, error: ERROR.VALIDATION_ERROR };
  }

  return { type: RESPONSE.TYPE_VALID, decodedToken };
}

async function validateDecodedToken(decodedToken) {
  let connection, error;

  const { user_uuid: encryptedUserUUID, jti } = decodedToken;

  //decrypt the user UUID using the combination of the JTI stored on the token
  //and the token session manager instance defined previously,
  //which then defines which IV to use to attempt the decryption
  const decryptedUserUUID = decryptData(
    tokenSessionManager,
    encryptedUserUUID,
    jti
  );

  try {
    connection = await pool.connect();

    const result = await connection.query(
      `SELECT * FROM users WHERE user_uuid = $1`,
      [decryptedUserUUID]
    );

    if (result.length !== 1) {
      throw new Error(ERROR.USER_NOT_FOUND);
    }
  } catch (err) {
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  //Only checking for errors in validation of the decrypted data itself, not the token,
  //and if there are none that means the token passed validation
  return { error, decryptedUserUUID };
}

//will use the decoded token otherwise returned from checkAuth mainly
function renewToken(decodedToken) {
  const { user_uuid: encryptedUserUUID, jti } = decodedToken;

  //basically checking if the associated session for the token exists
  //and thus still valid
  if (!tokenSessionManager.hasJti(jti)) {
    return { type: RESPONSE.TYPE_ERROR, error: ERROR.INVALID_JTI };
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
    updateResult = tokenSessionManager.updateExistingJti(jti, jtiNew);

  if (!updateResult) {
    return { type: RESPONSE.TYPE_ERROR, error: ERROR.JTI_UPDATE_FAILURE };
  }
  //just in case due to some async execution order that the IV is not present
  //at this stage for the same reason as previously

  return { type: RESPONSE.TYPE_TOKEN, newToken };
}

module.exports = { authUser, checkAuth, renewToken };
//will be used as utilities with middleware. Entire auth system will be within it's own child process
