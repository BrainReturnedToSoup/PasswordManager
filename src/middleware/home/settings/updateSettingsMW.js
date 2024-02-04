const pool = require("../../../services/postgresql.js");

const { validateAuth } = require("./common/auth.js");
const { validateSettingsObj } = require("../../../utils/inputValidation.js");
const { errorResponse } = require("./common/errorResponse.js");

const OUTBOUND_RESPONSE = require("../../../enums/serverResponseEnums.js");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//******UPDATE-SETTINGS*****/

//input/constraint validation
function validatePayload(req, res, next) {
  const valid = validateSettingsObj(req.body);

  //if one of the input properties is not of a valid value
  if (!valid) {
    errorResponse(req, res, 500, OUTBOUND_RESPONSE.CONSTR_VALIDATION_FAILURE);
    return;
  }

  next();
}

//for handling a request containing the most up to date rendition of user settings, which is sent when
//the user makes a change to any portion of the settings that relies on state.
async function updateSettings(req, res, next) {
  const { fontScale, themeSelected, lazyLoading, sessionLengthMinutes } =
    req.body;

  const { uuid } = req.checkAuth;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(
      `
        UPDATE user_settings 
        SET font_scale = $1,
            theme_selected = $2,
            lazy_loading = $3,
            session_length_minutes = $4
        WHERE user_uuid = $5
     `,
      [fontScale, themeSelected, lazyLoading, sessionLengthMinutes, uuid]
    );
  } catch (err) {
    console.error(
      `updateSettingsMW: updateSettings catch block: ${err} ${err.stack}`
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

const updateSettingsMW = [
  validateAuth,
  validatePayload,
  updateSettings,
  renewToken,
];

module.exports = updateSettingsMW;
