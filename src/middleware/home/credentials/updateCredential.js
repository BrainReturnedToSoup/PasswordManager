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

//takes the credential parameters such as email and password, and overwrites the
//corresponding credentials already in the db linked to the corresponding user.
//used the credential ID to locate the corresponding credentials

function validatePayload(req, res, next) {
  const valid = inputValidation.updateCredential(req.body);

  if (!valid) {
    console.error(`updateCredential validatePayload error: invalid-value`);
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.INVALID_VALUE);
    return;
  }

  next();
}

async function updateCredential(req, res, next) {
  const { credentialID } = req.body;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(`BEGIN`);

    //make updates based on the existence of corresponding properties in the req body
    if ("name" in req.body) {
      await connection.query(
        `
        UPDATE credentials
        SET credential_name = $1
        WHERE credential_id = $2
        `,
        [req.body.name, credentialID]
      );
    }

    if ("emailUsername" in req.body) {
      await connection.query(
        `
        UPDATE credentials
        SET email_username = $1
        WHERE credential_id = $2
        `,
        [req.body.emailUsername, credentialID]
      );
    }

    if ("password" in req.body) {
      await connection.query(
        `
        UPDATE credentials
        SET pw = $1
        WHERE credential_id = $2
        `,
        [req.body.password, credentialID]
      );
    }

    if ("description" in req.body) {
      await connection.query(
        `
        UPDATE credentials
        SET description = $1
        WHERE credential_id = $2
        `,
        [req.body.description, credentialID]
      );
    }

    await connection.query(`COMMIT`);
  } catch (err) {
    console.error(
      `updateCredetnial: updateCredential catch block: ${err} ${err.stack}`
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

const updateCredentialMW = [
  validateAuth,
  validatePayload,
  updateCredential,
  renewToken,
];

module.exports = updateCredentialMW;
