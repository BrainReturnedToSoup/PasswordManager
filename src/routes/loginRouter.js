const router = require("express").Router();
const cors = require("cors");

const serveBundle = require("../utils/serveBundle");
const { handleLogin } = require("../middleware/loginMW");

//**************CORS**************/

const postOptions = {
  origin: [process.env.SERVER_ORIGIN],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

//*************Routes*************/

router.get("/", serveBundle);
router.post("/", cors(postOptions), handleLogin);

module.exports = router;
