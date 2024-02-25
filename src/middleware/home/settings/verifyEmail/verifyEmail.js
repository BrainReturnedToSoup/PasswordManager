const { validateAuth } = require("../../_common/auth.js");
const errorResponse = require("../../_common/errorResponse.js");
const pool = require("../../../../services/postgresql");
const { inputValidation } = require("../../../../utils/inputValidation");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//validates the supplied code for verification from the user
function validatePayload(req, res, next) {
  const valid = inputValidation.verifyEmail(req.body.code);

  if (!valid) {
    errorResponse(req, res, 500, "invalid-input");
    return;
  }

  next();
}

//retrieves the verification code and expiry corresponding to the user's session.
//They should have created this resource when sending a verification code to their email.
async function retrieveVerificationData(req, res, next) {
  const { uuid } = req.checkAuth;

  let connection, result, error;

  try {
    connection = await pool.connect();

    result = await connection.oneOrNone(
      `
        SELECT verification_code, creation_timestamp
        FROM verification
        WHERE user_uuid = $1
        `,
      [uuid]
    );
  } catch (err) {
    console.error(
      `verifyEmail: retrieveStoredCode catch block: ${err} ${err.stack}`
    );
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

  req.storedCode = result.verification_code;
  req.creationTimestamp = result.creation_timestamp;

  next();
}

//validates if the corresponding verification request for the current session has expired or not
function validateExpiry(req, res, next) {
  const { creationTimestamp } = req;
  const currentTimestamp = new Date();
  const tenMinutesInSeconds = 600;

  const differenceInSeconds =
    (creationTimestamp.getTime() - currentTimestamp.getTime()) * 1000;

  if (differenceInSeconds > tenMinutesInSeconds) {
    errorResponse(req, res, 500, "verification-code-expired");
    return;
  }

  next();
}

//validates whether the supplied code matches the code set for the account
function validateCode(req, res, next) {
  const { storedCode } = req,
    { code } = req.body;

  if (storedCode !== code) {
    errorResponse(req, res, 500, "incorrect-code");
    return;
  }

  next();
}

//updates the verification status of the user to true, as well as deletes the verification
//resources as they are not needed anymore.
async function applyVerification(req, res, next) {
  const { uuid } = req.checkAuth;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(`BEGIN`);

    await connection.query(
      `
      DELETE FROM verification
      WHERE user_uuid = $1
    `,
      [uuid]
    );

    await connection.query(
      `
        UPDATE user_settings
        SET verified = $1
        WHERE user_uuid = $2
    `,
      [true, uuid]
    );

    await connection.query(`COMMIT`);
  } catch (err) {
    console.error(
      `verifyEmail: updateVerification catch block: ${err} ${err.stack}`
    );
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

  next();
}

function renewToken(req, res) {
  const { newToken } = req.checkAuth;

  res
    .status(200)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true });
}

const verifyEmail = [
  validateAuth,
  validatePayload,
  retrieveVerificationData,
  validateExpiry,
  validateCode,
  applyVerification,
  renewToken,
];

module.exports = verifyEmail;
