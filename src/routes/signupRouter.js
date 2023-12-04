const router = require("express").Router();
const cors = require("cors");

const { signupGetMW, signupPostMW } = require("../middleware/signupMW");

//*************Routes**************/

router.get("/", signupGetMW);

const postOptions = {
  origin: [process.env.SERVER_ORIGIN + "/sign-up"],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

router.post("/", cors(postOptions), signupPostMW);

module.exports = router;
