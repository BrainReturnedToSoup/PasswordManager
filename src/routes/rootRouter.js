const router = require("express").Router();

const rootMW = require("../middleware/rootMW");

const loginRouter = require("./loginRouter"),
  signupRouter = require("./signupRouter"),
  homeRouter = require("./home/homeRouter"),
  authStateRouter = require("./authStateRouter");

//*************Routes*************/

//serves the client bundle SPA starting at the root
//page. The redirect will occur on the client
router.get("/", rootMW);

router.use("/log-in", loginRouter);
router.use("/sign-up", signupRouter);
router.use("/home", homeRouter);
router.use("/auth-state", authStateRouter);

module.exports = router;
