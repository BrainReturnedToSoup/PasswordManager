const router = require("express").Router();
const cors = require("cors");

const { homeGetMW } = require("../middleware/homeMW");

//*************Routes*************/

router.get("/", homeGetMW); //for the home page

const postOptions = {
  origin: [process.env.SERVER_ORIGIN + "/home"],
  methods: "POST",
  credentials: true,
};

router.post("/", cors(postOptions));

module.exports = router;
