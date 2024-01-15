const router = require("express").Router();
const cors = require("cors");

const {
  homeGetMW,
  homePostNewCredsMW,
  homePostSettingsMW,
} = require("../middleware/homeMW");

//*************Routes*************/

router.get("/", homeGetMW); //for the home page

const postOptions = {
  origin: [process.env.SERVER_ORIGIN + "/home"],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

router.post("/settings", cors(postOptions), homePostSettingsMW);

router.post("/new-credentials", cors(postOptions), homePostNewCredsMW);

module.exports = router;
