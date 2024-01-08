const router = require("express").Router();
const cors = require("cors");

const logoutPostMW = require("../middleware/logoutMW");

//*************Routes*************/

const postOptions = {
  origin: [process.env.SERVER_ORIGIN + "/home"],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

router.post("/log-out", cors(postOptions), logoutPostMW);

module.exports = router;
