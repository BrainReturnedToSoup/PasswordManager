const router = require("express").Router();
const cors = require("cors");

const checkCurrentAuthState = require("../middleware/authStateMW");

//**************CORS**************/

const getOptions = {
  origin: [process.env.SERVER_ORIGIN],
  methods: "GET",
  credentials: true, //for allowing cookies to be sent in the request
};

//*************Routes*************/

router.get("/", cors(getOptions), checkCurrentAuthState);

module.exports = router;
