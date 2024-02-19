const { validateAuth } = require("../_common/auth");
const errorResponse = require("../_common/errorResponse");

const pool = require("../../../../services/postgresql");

const sendMail = require("../../../../utils/mail");
const generateCode = require("../../../../utils/generateCode");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//will create the verification code corresponding to the session and store it/overwrite the DB
async function generateCode(req, res, next) {
  const { uuid } = req.checkAuth;

  const verificationCode = generateCode();

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
      INSERT INTO verification (
        user_uuid,
        verification_code,
        creation_timestamp
      )
      VALUES ($1, $2, $3)
      `,
      [uuid, verificationCode, new Date()]
    );

    await connection.query(`COMMIT`);
  } catch (err) {
    console.error(
      `verifyEmail: createResource catch block: ${err} ${err.stack}`
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

  req.verificationCode = verificationCode;

  next();
}

//retrieves the email corresponding to the session
async function retrieveEmail(req, res, next) {
  const { uuid } = req.checkAuth;

  let connection, result, error;

  try {
    connection = await pool.connect();

    result = await connection.oneOrNone(
      `
      SELECT email
      FROM users
      WHERE user_uuid = $1
      `,
      [uuid]
    );
  } catch (err) {
    console.error(`sendCode: retrieveEmail catch block: ${err} ${err.stack}`);
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

  req.email = result.email;

  next();
}

//takes the previously made code and emails it to the user using the retrieved email
async function sendCode(req, res, next) {
  const { email, verificationCode } = req;

  const mailOptions = {
    from: PROCESS.ENV.MAIL_USER,
    to: email,
    subject: "Email Verification Code",
    text: `Here is the code for verifying your account: ${verificationCode}`,
  };

  try {
    await sendMail(mailOptions); //promisified version of the sendMail api on a transporter instance
  } catch (error) {
    console.error(`verifyEmail: sendLink catch block: ${error} ${error.stack}`);
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

const initCode = [
  validateAuth,
  generateCode,
  retrieveEmail,
  sendCode,
  renewToken,
];

module.exports = initCode;
