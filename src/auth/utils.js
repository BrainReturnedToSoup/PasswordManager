const pool = require("../services/postgresql.js");

const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const { JWT_ERROR } = require("../enums/jwtEnums.js");
const { DataError, ProcessError } = require("./customErrors.js");

const {
  encryptData,
  decryptData,
  TokenSessionManager,
} = require("./cryptography.js");

//for managing 'sessions' via established JTI-IV relationships. This is important
//for remembering which IV is used for decrypting a specific token, even if the JTI
//is constantly changing. The JTI is changed per successful request with a specific token.
const tokenSessionManager = new TokenSessionManager();

//**********GET-PASSWORD**************/

//for authUser
async function getUuidAndPassword(email) {
  let connection, result, error;

  //****INSTANT-CONNECTION-TERMINATION****/
  try {
    connection = await pool.connect();
    result = await connection.oneOrNone(
      `SELECT user_uuid, pw FROM users WHERE email = $1`,
      [email]
    );
  } catch (err) {
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } //always release the connection as soon as possible
  }

  if (error) {
    throw error;
  }

  //a user corresponding to the supplied email does not exist
  if (!result) {
    throw new DataError(JWT_ERROR.USER_NOT_FOUND);
  }

  return result;
}

//**********RENEW-TOKEN***************/

//create an entirely new token using the same encrypted user_uuid value
//but with a new jti. This jti is updated in the session manager to the corres IV

//for checkAuth
function renewToken(decodedToken) {
  const { user_uuid, jti, exp } = decodedToken;

  const newJti = uuid(),
    payload = {
      user_uuid,
      jti: newJti,
      exp,
    };

  const success = tokenSessionManager.updateExistingJti(jti, newJti);

  if (!success) {
    throw new ProcessError(JWT_ERROR.JTI_UPDATE_FAILURE);
  }

  return jwt.sign(payload, process.env.JWT_SK);
}

//decrypt the user UUID using the combination of the JTI stored on the token
//and the token session manager instance defined previously,
//which then defines which IV to use to attempt the decryption

//for checkAuth
async function validateDecodedToken(decodedToken) {
  const { user_uuid: encryptedUUID, jti } = decodedToken;

  if (!tokenSessionManager.hasJti(jti)) {
    throw new DataError(JWT_ERROR.INVALID_JTI);
  }

  const decryptedUUID = decryptData(tokenSessionManager, encryptedUUID, jti);

  //if a user exists corresponding to the decrypted uuid from the token, then the token is valid
  let result, connection, error;

  try {
    connection = await pool.connect();
    result = await connection.oneOrNone(
      `SELECT email, pw FROM users WHERE user_uuid = $1`,
      [decryptedUUID]
    );
  } catch (err) {
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } //always release the connection as soon as possible
  }

  if (error) {
    throw error;
  }

  if (!result) {
    throw new DataError(JWT_ERROR.USER_NOT_FOUND);
  }

  return decryptedUUID;
}

//**********SESSION-MANAGEMENT********/

//create a new session for the corresponding user, which this is managed via
//an IV that stays the same for the encrypted user_uuid property data within the payload,
//which the JTI is meant to be changed every time a successful response is made with
//a valid token.

//encrypted using AES256, which the corresponding IV for this specific 'session' is
//saved and linked to the JTI that is saved in the token. This way, when a request is made
//with the token, it's easy to decrypt the encrypted user UUID, and make the necessary JTI updates

//for checkAuth
function createSession(suppliedUUID) {
  const startingJti = uuid(), //JTI for new token corresponding to the new session
    { encryptedString: encryptedUUID, newHexIV } = encryptData(suppliedUUID);

  const success = tokenSessionManager.createSession(startingJti, newHexIV);

  if (!success) {
    throw new ProcessError(JWT_ERROR.SESSION_CREATION_FAILURE);
  }

  const payload = {
    user_uuid: encryptedUUID,
    exp: generateExpirationTime(),
    jti: startingJti,
  };

  return jwt.sign(payload, process.env.JWT_SK);
}

//for deauthUser
function terminateSession(encodedToken) {
  //if the jti doesn't exist within the session manager, it won't break the runtime and thus no error.
  const { jti } = jwt.decode(encodedToken);
  tokenSessionManager.terminateSession(jti);
}

//*********EXPIRY-GENERATION**********/

//for generating the expiration time stamp for any token that is created
//define the number of seconds each token should be given
function generateExpirationTime() {
  const oneSecondFromMS = 1000;

  return (
    Math.floor(Date.now() / oneSecondFromMS) +
    parseInt(process.env.JWT_EXP_SECONDS)
  );
}

module.exports = {
  getUuidAndPassword,
  renewToken,
  validateDecodedToken,
  terminateSession,
  createSession,
};
