const router = require("express").Router();

const getSettingsMW = require("../../middleware/home/settings/getSettingsMW.js");

const updateSettingsMW = require("../../middleware/home/settings/updateSettingsMW.js");
const deleteAccountMW = require("../../middleware/home/settings/deleteAccountMW.js");
const setNewPasswordMW = require("../../middleware/home/settings/setNewPasswordMW.js");
const setNewEmailMW = require("../../middleware/home/settings/setNewEmail.js");
const verifyEmailMW = require("../../middleware/home/settings/verifyEmailMW.js");

router.get("/", getSettingsMW);
//defining the newest set of settings linked to a users account
router.post("/update-settings", updateSettingsMW);
router.post("/delete-account", deleteAccountMW);
router.post("/new-password", setNewPasswordMW);
router.post("/new-email", setNewEmailMW);
// router.post("/verify-email", verifyEmailMW);

module.exports = router;
