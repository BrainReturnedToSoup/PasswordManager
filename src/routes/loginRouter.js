const router = require("express").Router();
const cors = require("cors");

const { loginGetMW, loginPostMW } = require("../middleware/loginMW");

//*************Routes*************/

router.get("/", loginGetMW);

const postOptions = {
  origin: [process.env.SERVER_ORIGIN + "/log-in"],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

router.post("/", cors(postOptions), loginPostMW);

module.exports = router;
