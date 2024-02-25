const router = require("express").Router();

const getSettingsMW = require("../../../middleware/home/settings/getSettingsMW.js"),
  updateSettingsMW = require("../../../middleware/home/settings/updateSettingsMW.js"),
  deleteAccountMW = require("../../../middleware/home/settings/deleteAccountMW.js"),
  setNewPasswordMW = require("../../../middleware/home/settings/setNewPasswordMW.js"),
  setNewEmailMW = require("../../../middleware/home/settings/setNewEmail.js");

const verifyEmailRouter = require("./verifyEmailRouter.js");

//defining the newest set of settings linked to a users account
router.get("/", getSettingsMW);
router.post("/", updateSettingsMW);
router.put("/password", setNewPasswordMW);
router.put("/email", setNewEmailMW);
router.delete("/account", deleteAccountMW);

router.use("/verify-email", verifyEmailRouter);

module.exports = router;
