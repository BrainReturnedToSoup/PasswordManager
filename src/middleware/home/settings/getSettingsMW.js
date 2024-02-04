const { validateAuth } = require("./common/auth");
const { errorResponse } = require("./common/errorResponse");

const pool = require("../../../services/postgresql.js");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

async function getSettings(req, res, next) {
  const { uuid } = req.checkAuth;

  let connection, result, error;

  try {
    connection = await pool.connect();

    result = await connection.oneOrNone(
      `
        SELECT 
          verified,
          font_scale,
          theme_selected,
          lazy_loading,
          session_length_minutes
        FROM user_settings
        WHERE user_uuid = $1
        `,
      [uuid]
    );
  } catch (err) {
    console.error(`getSettings catch block: ${err} ${err.stack}`);
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

  req.settings = result;

  next();
}

function renewToken(req, res) {
  const { newToken } = req.checkAuth,
    { settings } = req;

  res
    .status(200)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true, settings });
}

const getSettingsMW = [validateAuth, getSettings, renewToken];

module.exports = getSettingsMW;
