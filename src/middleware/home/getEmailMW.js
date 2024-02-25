const pool = require("../../services/postgresql.js");
const { validateAuth } = require("./_common/auth.js");
const errorResponse = require("./_common/errorResponse.js");
const censorEmail = require("../../utils/censorEmail.js");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

async function getEmail(req, res, next) {
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
    console.error(`getEmail catch block: ${err} ${err.stack}`);
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

  req.email = censorEmail(result.email);

  next();
}

function renewToken(req, res) {
  const { newToken } = req.checkAuth,
    { email } = req;

  res
    .status(200)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true, email });
}

const getEmailMW = [validateAuth, getEmail, renewToken];

module.exports = getEmailMW;
