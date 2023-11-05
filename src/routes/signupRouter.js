const router = require("express").Router();

//*************Routes**************/
const { signupPageMW, signupPostMW } = require("../middleware/signupRouter");

router.get("/", signupPageMW);
router.post("/", signupPostMW);

module.exports = router;
