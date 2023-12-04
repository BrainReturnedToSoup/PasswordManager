const router = require("express").Router();

const checkCurrentAuthState = require("../middleware/authStateMW");
const cors = require("cors");

//*************Routes*************/

const getOptions = {
  origin: [
    process.env.SERVER_ORIGIN + "/log-in",
    process.env.SERVER_ORIGIN + "/sign-up",
    process.env.SERVER_ORIGIN + "/home",
  ],
  methods: "GET",
  credentials: true, //for allowing cookies to be sent in the request
};

router.get("/", cors(getOptions), checkCurrentAuthState);

module.exports = router;
