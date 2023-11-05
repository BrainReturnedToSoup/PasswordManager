const router = require("express").Router();

//*************Routes*************/
const { loginPageMW, loginPostMW } = require("../middleware/loginMW");

router.get("/", loginPageMW);
router.post("/", loginPostMW);

module.exports = router;
