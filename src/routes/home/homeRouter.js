const router = require("express").Router();
const cors = require("cors");

const homeGetMW = require("../../middleware/home/homeMW");
const getEmailMW = require("../../middleware/home/getEmailMW");
const logoutRouter = require("./logoutRouter"),
  settingsRouter = require("./settings/settingsRouter"),
  credentialsRouter = require("./credentialsRouter");

//**************CORS**************/

const getOptions = {
  origin: [process.env.SERVER_ORIGIN],
  methods: "GET",
  credentials: true,
};

const postOptions = {
  origin: [process.env.SERVER_ORIGIN],
  methods: "POST",
  credentials: true, //for allowing cookies to be sent in the request
};

//*************Routes*************/

router.get("/", homeGetMW); //for the home page
router.get("/email", cors(getOptions), getEmailMW); //for retrieving the censored email

//cors applies to all router children stemming from each of these individual routers children
router.use("/log-out", cors(postOptions), logoutRouter);
router.use("/settings", cors(postOptions), settingsRouter);
router.use("/credentials", cors(postOptions), credentialsRouter);

module.exports = router;
