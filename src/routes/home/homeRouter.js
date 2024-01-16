const router = require("express").Router();
const cors = require("cors");

const { homeGetMW } = require("../../middleware/home/homeMW");

const logoutRouter = require("./logoutRouter"),
  settingsRouter = require("./settingsRouter"),
  credentialsRouter = require("./credentialsRouter");

//**************CORS**************/

const postOptions = {
  origin: [process.env.SERVER_ORIGIN],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

//*************Routes*************/

router.get("/", homeGetMW); //for the home page

//cors applies to all router children stemming from each of these individual routers children
router.use("/log-out", cors(postOptions), logoutRouter);
router.use("/settings", cors(postOptions), settingsRouter);
router.use("/credentials", cors(postOptions), credentialsRouter);

module.exports = router;
