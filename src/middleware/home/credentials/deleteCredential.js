const validateAuth = require("./_common/auth.js");
const errorResponse = require("./_common/errorResponse.js");
const { inputValidation } = require("../../../utils/inputValidation");

const OUTBOUND_RESPONSE = require("../../../enums/serverResponseEnums.js");

const pool = require("../../../services/postgresql.js");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//completely deletes the corresponding credentials, utilizing the credential ID
//as the identifier for the information

function validatePayload(req, res, next) {
  if (!req.query.credentialID) {
    console.error(`deleteCredential validatePayload error: no-credentialID`);
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
    return;
  }

  const valid = inputValidation.deleteCredential(req.query.credentialID);

  if (!valid) {
    console.error(`deleteCredential validatePayload error: invalid-value`);
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
    return;
  }

  next();
}

async function deleteCredential(req, res, next) {
  const { credentialID } = req.query,
    { uuid } = req.checkAuth;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(
      `
        DELETE FROM credentials
        WHERE user_uuid = $1
          AND credential_id = $2
    `,
      [uuid, credentialID]
    );
  } catch (err) {
    console.error(
      `deleteCredential: deleteCredential catch block: ${err} ${err.stack}`
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

  next();
}

function renewToken(req, res) {
  const { newToken } = req.checkAuth;

  res
    .status(200)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true });
}

const deleteCredentialMW = [
  validateAuth,
  validatePayload,
  deleteCredential,
  renewToken,
];

module.exports = deleteCredentialMW;
