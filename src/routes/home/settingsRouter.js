const router = require("express").Router();

const {
  homePostNewPrefsMW,
  homePostDeleteAccMW,
  homePostNewPasswordMW,
  homePostVerifyEmailMW,
} = require("../../middleware/home/settingsMW");

//defining the newest set of settings linked to a users account
router.post("/new-preferences", homePostNewPrefsMW);
router.post("/delete-account", homePostDeleteAccMW);
router.post("/new-password", homePostNewPasswordMW);
router.post("/verify-email", homePostVerifyEmailMW);

module.exports = router;
