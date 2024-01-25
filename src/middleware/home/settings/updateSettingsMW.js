const pool = require("../../../services/postgresql.js");

const { validateAuth } = require("./common/auth.js");

const { validateSettingsObj } = require("../../../utils/inputValidation.js");

const OUTBOUND_RESPONSE = require("../../../enums/serverResponseEnums.js");

//******UPDATE-SETTINGS*****/

//input/constraint validation
function validatePayload(req, res, next) {
  const valid = validateSettingsObj(req.body);

  //if one of the input properties is not of a valid value
  if (!valid) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.INVALID_VALUE });
    return;
  }

  next();
}

//for handling a request containing the most up to date rendition of user settings, which is sent when
//the user makes a change to any portion of the settings that relies on state.
async function updateSettings(req, res) {
  const { fontScale, themeSelected, lazyLoading, sessionLengthMinutes } =
    req.body;

  const { uuid } = req.checkAuth;

  let connection, error;

  try {
    connection = await pool.connect();

    await connection.query(
      `
        UPDATE user_settings 
        SET font_scale = $2,
            theme_selected = $3,
            lazy_loading = $4,
            session_length_minutes = $5
        WHERE user_uuid = $6
     `,
      [fontScale, themeSelected, lazyLoading, sessionLengthMinutes, uuid]
    );
  } catch (err) {
    console.error(
      `updateSettingsMW: updateSettings catch block: ${err} ${err.stack}`
    );
    error = err;
  } finally {
    if (connection && typeof connection.release === "function") {
      connection.release();
    } //always release the connection as soon as possible
  }

  if (error) {
    res.status(500).json({ success: false, error });
    return;
  }

  res.status(200).json({ success: true });
}

const updateSettingsMW = [validateAuth, validatePayload, updateSettings];

module.exports = updateSettingsMW;
