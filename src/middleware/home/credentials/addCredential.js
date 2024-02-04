const { validateAuth } = require("./common/auth");

const { errorResponse } = require("./common/errorResponse.js");

const { inputValidation } = require("../../../utils/inputValidation");

const OUTBOUND_RESPONSE = require("../../../enums/serverResponseEnums.js");

const { v4: generateUUID } = require("uuid");

const pool = require("../../../services/postgresql.js");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//takes the credential parameters such as email and password, and adds them
//to the db linked to the corresponding user.
//Creates a new credential ID corresponding to the specific new pair.

function validatePayload(req, res, next) {
  const valid = inputValidation.addCredential(req.body);

  if (!valid) {
    console.error(`addCredential validatePayload: invalid-value`);
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
    return;
  }

  next();
}

async function addCredential(req, res, next) {
  const { name, emailUsername, password, description } = req.body,
    { uuid } = req.checkAuth;

  const newCredID = generateUUID();

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(
      `
    INSERT INTO credentials (
        credential_id,
        user_uuid,
        credential_name,
        email_username,
        pw,
        description
    )
    VALUES( $1, $2, $3, $4, $5, $6)
    `,
      [newCredID, uuid, name, emailUsername, password, description]
    );
  } catch (err) {
    console.error(
      `addCredential: addCredential catch block: ${err} ${err.stack}`
    );
    error = err;
  } finally {
    if (connection) {
      connection.done();
    } //always release the connection as soon as possible
  }

  if (error) {
    errorResponse(req, res, 500, error);
    return;
  }

  req.credentialID = newCredID; //send the credentialID back to the client for caching

  next();
}

function renewToken(req, res) {
  const { newToken } = req.checkAuth,
    { credentialID } = req;

  res
    .status(200)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true, credentialID });
}

const addCredentialMW = [
  validateAuth,
  validatePayload,
  addCredential,
  renewToken,
];

module.exports = addCredentialMW;
