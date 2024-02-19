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

function validatePayload(req, res, next) {
  if (!req.query.credentialID) {
    console.error(`getCredential validatePayload error: no-credentialID`);
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
    return;
  }

  const valid = inputValidation.getCredential(req.query.credentialID);

  if (!valid) {
    console.error(`getCredential validatePayload error: invalid-value`);
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
    return;
  }

  next();
}

async function getCredential(req, res, next) {
  const { credentialID } = req.query,
    { uuid } = req.checkAuth;

  let connection, result, error;

  try {
    connection = await pool.connect();

    result = await connection.oneOrNone(
      `
      SELECT
        credential_name,
        email_username,
        pw,
        description
      FROM credentials
      WHERE user_uuid = $1
        AND credential_id = $2
        `,
      [uuid, credentialID]
    );
  } catch (err) {
    console.error(`getCredential catch block: ${err} ${err.stack}`);
    error = err;
  } finally {
    if (connection) {
      connection.done();
    }
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
    .status(200)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true, credential });
}

const getCredentialMW = [validateAuth, getCredential, renewToken];

module.exports = getCredentialMW;
