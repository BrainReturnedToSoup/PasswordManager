const router = require("express").Router();
const cors = require("cors");

const serveBundle = require("../utils/serveBundle");
const { handleSignup } = require("../middleware/signupMW");

//**************CORS**************/

const postOptions = {
  origin: [process.env.SERVER_ORIGIN],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

//*************Routes**************/

router.get("/", serveBundle);
router.post("/", cors(postOptions), handleSignup);

module.exports = router;
