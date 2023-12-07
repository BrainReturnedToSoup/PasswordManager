const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const pool = require("../services/postgresql.js");

const {
  encryptData,
  decryptData,
  TokenSessionManager,
} = require("./tokenCrypto.js");

const tokenSessionManager = new TokenSessionManager();

//for generating the expiration time stamp for any token that is created
//define the number of seconds each token should be given
function generateExpirationTime() {
  return Math.floor(Date.now() / 1000) + parseInt(process.env.JWT_EXP_SECONDS);
}

async function authUser(email, password) {
  let connection, user, authError;

  try {
    connection = await pool.connect();

    const result = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (result.length !== 1) {
      throw new Error("invalid-credentials");
    }

    const fetchedUser = result[0],
      match = await bcrypt.compare(password, fetchedUser.pw);

    if (!match) {
      throw new Error("invalid-credentials");
    }

    user = fetchedUser;
  } catch (err) {
    authError = err;
  } finally {
    //always release the connection after attempting db actions
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  if (authError) {
    return { type: "error", error: authError };
  }

  if (user) {
    const { user_uuid } = user;

    const JTI = uuid(),
      { encryptedString: encryptedUUID, newHexIV } = encryptData(
        tokenSessionManager,
        user_uuid
      );
    //creating the starting JTI that will be inserted into the starting JWT token, also encrypt
    //the user_uuid retrieved, which the encryptData function will generate a random IV for
    //the specific encryption operation, which is used across the same session even with renewed tokens
    //on the session

    const newSession = tokenSessionManager.createSession(JTI, newHexIV);
    //create a new session for the corresponding user, which this is managed via
    //an IV that stays the same for the encrypted user_uuid property data within the payload,
    //which the JTI is meant to be changed every time a successful response is made with
    //a valid token

    if (!newSession.success) {
      return { type: "error", error: "session-creation-failure" };
    }

    const payload = {
      user_uuid: encryptedUUID,
      exp: generateExpirationTime(),
      jti: JTI,
    };
    //finally, take the encrypted UUID string and generated JTI and store them into the token payload
    //This way, this token can only be used once with the corresponding JTI, and the user_uuid is encrypted
    //and can only be decrypted with the proper IV and JTI pair based on the session. The corresponding IV
    //is retrieved in the session state and used for decryption using the JTI as the lookup key.

    const token = jwt.sign(payload, process.env.JWT_SK);

    return { type: "token", token };
  }
}

async function checkAuth(cookies) {
  //used to turn the passport authentication into a utility function
  //rather than a middleware declaration
  if (!cookies.jwt) {
    return { type: "error", error: "no-token" };
  }

  let decodedToken, decodingError;

  try {
    decodedToken = jwt.verify(cookies.jwt, process.env.JWT_SK);
  } catch (err) {
    decodingError = err;
  }

  if (decodingError) {
    return { type: "error", error: "invalid-token" };
  }

  const { validationError } = await validateDecodedToken(decodedToken);

  if (validationError === "user-not-found") {
    return { type: "error", error: "invalid-token" };
  }

  if (validationError) {
    return { type: "error", error: "validation-error" };
  }

  return { type: "valid", decodedToken };
}

function renewToken(decodedToken) {
  const { user_uuid: encryptedUserUUID, jti } = decodedToken;
  //will use the decoded token otherwise returned from checkAuth mainly

  const corresIV = tokenSessionManager.retrieveCorrespondingIV(jti);
  //retrieve the corresponding IV relating to the decoded token, which should work
  //because renewal will only occur after checkAuth, which validates for the existence of the IV

  if (!corresIV) {
    return { type: "error", error: "IV-retrieval-failure" };
  }
  //just in case due to some async execution order that the IV is in fact not present
  //most likely due to the setTimeout deleting such automatically

  const newJTI = uuid(),
    payload = {
      user_uuid: encryptedUserUUID,
      exp: generateExpirationTime(),
      jti: newJTI,
    };

  //create an entirely new token using the same encrypted user_uuid value,
  //but supply a new JTI and expiry time to the token. The JTI is synced up with
  //the corresponding IV after the creation, so that the new token can still be properly
  //decrypted, thus simulating a 'session'
  const newToken = jwt.sign(payload, process.env.JWT_SK),
    updateResult = tokenSessionManager.updateExistingJTI(newJTI, corresIV);

  if (!updateResult) {
    return { type: "error", error: "JTI-update-failure" };
  }
  //just in case due to some async execution order that the IV is not present
  //at this stage for the same reason as previously

  return { type: "token", newToken };
}

async function validateDecodedToken(decodedToken) {
  let connection, error;
  //in order to handle connection release in a straightforward manner before
  //returning the values

  const { user_uuid: encryptedUserUUID, jti } = decodedToken;

  //decrypt the user UUID using the combination of the JTI stored on the token
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
      throw new Error("user-not-found");
    }
  } catch (err) {
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    }
  }

  //basically only checking for errors in validation, and if there are none
  //that means the token passed validation
  return { error };
}

module.exports = { authUser, checkAuth, renewToken };
//export to be used as a helper function in the middleware
//This way, middleware can behave based on the output of these functions
//as opposed to using the functions as middleware themselves
