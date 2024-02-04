const { validateAuth } = require("./common/auth");

const { errorResponse } = require("./common/errorResponse.js");

const { inputValidation } = require("../../../utils/inputValidation");

const OUTBOUND_RESPONSE = require("../../../enums/serverResponseEnums.js");

const pool = require("../../../services/postgresql.js");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//specific endpoint to retrieve the actual credentials corresponding to the credential box on the screen.
//This information is requested by clicking on a view button, which doesn't require storing any credentials
//in client state itself, just their IDs that normalize to the information on the server

function validatePayload(req, res, next) {
  const valid = inputValidation.getCredential(req.body);

  if (!valid) {
    console.error(`getCredential validatePayload error: invalid-value`);
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
    return;
  }

  next();
}

async function getCredential(req, res, next) {
  const { credentialID } = req.body;

  let connection, result, error;

  try {
    connection = await pool.connect();

    await connection.oneOrNone(
      `
      SELECT 
        credential_name,
        email_username,
        pw
      FROM credentials
      WHERE credential_id = $1
      `,
      [credentialID]
    );
  } catch (err) {
    console.error(
      `getCredential: getCredential catch block: ${err} ${err.stack}`
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

  req.credential = result;

  next();
}

function renewToken(req, res) {
  const { newToken } = req.checkAuth,
    { credential } = req;

  res
    .status(500)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true, credential });
}

const getCredentialMW = [
  validateAuth,
  validatePayload,
  getCredential,
  renewToken,
];

module.exports = getCredentialMW;
