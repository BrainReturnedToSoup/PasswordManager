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
    console.error(`getDesription validatePayload error: no-credentialID`);
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
  }

  const valid = inputValidation.getDescription(req.query.credentialID);

  if (!valid) {
    console.error(`getDesription validatePayload error: invalid-value`);
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
    return;
  }

  next();
}

async function getDescription(req, res, next) {
  const { uuid } = req.checkAuth,
    { credentialID } = req.query;

  let connection, result, error;

  try {
    connection = await pool.connect();

    result = await connection.oneOrNone(
      `
        SELECT description
        FROM credentials
        WHERE credential_id = $1
          AND user_uuid = $2
        `,
      [credentialID, uuid]
    );
  } catch (err) {
    console.error(`getDescription catch block: ${err} ${err.stack}`);
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

  req.description = result.description;

  next();
}

function renewToken(req, res) {
  const { newToken } = req.checkAuth,
    { description } = req;

  res
    .status(200)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true, description });
}

const getDescriptionMW = [
  validateAuth,
  validatePayload,
  getDescription,
  renewToken,
];

module.exports = getDescriptionMW;
