const router = require("express").Router();
const cors = require("cors");

const { signupGetMW, signupPostMW } = require("../middleware/signupMW");

//**************CORS**************/

const postOptions = {
  origin: [process.env.SERVER_ORIGIN],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

//*************Routes**************/

router.get("/", signupGetMW);
router.post("/", cors(postOptions), signupPostMW);

module.exports = router;
