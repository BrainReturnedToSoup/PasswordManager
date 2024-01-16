const router = require("express").Router();
const cors = require("cors");

const { loginGetMW, loginPostMW } = require("../middleware/loginMW");

//**************CORS**************/

const postOptions = {
  origin: [process.env.SERVER_ORIGIN],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

//*************Routes*************/

router.get("/", loginGetMW);
router.post("/", cors(postOptions), loginPostMW);

module.exports = router;
