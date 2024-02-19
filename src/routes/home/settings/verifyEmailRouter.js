const router = require("express").Router();

const verifyEmail = require("../../../middleware/home/settings/verifyEmail/verifyEmail"),
  initCode = require("../../../middleware/home/settings/verifyEmail/initCode");

//either creates a new verification code, or reuses an existing one, and
//send it to the user via email for the user to copy and paste into the form for email verification
router.post("/", initCode);

//takes the verification code supplied by a request, 
router.put("/", verifyEmail);

module.exports = router;
