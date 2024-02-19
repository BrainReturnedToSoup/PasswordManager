const router = require("express").Router();

const getSettingsMW = require("../../../middleware/home/settings/getSettingsMW.js");
const updateSettingsMW = require("../../../middleware/home/settings/updateSettingsMW.js"),
  deleteAccountMW = require("../../../middleware/home/settings/deleteAccountMW.js"),
  setNewPasswordMW = require("../../../middleware/home/settings/setNewPasswordMW.js"),
  setNewEmailMW = require("../../../middleware/home/settings/setNewEmail.js");

const verifyEmailRouter = require("./verifyEmailRouter.js");

//defining the newest set of settings linked to a users account
router.get("/", getSettingsMW);

router.post("/update-settings", updateSettingsMW);
router.post("/delete-account", deleteAccountMW);
router.post("/new-password", setNewPasswordMW);
router.post("/new-email", setNewEmailMW);

router.use("/verify-email", verifyEmailRouter);

module.exports = router;
