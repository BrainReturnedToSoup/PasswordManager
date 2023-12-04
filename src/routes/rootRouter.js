const router = require("express").Router();

const loginRouter = require("./loginRouter"),
  signupRouter = require("./signupRouter"),
  homeRouter = require("./homeRouter"),
  authStateRouter = require("./authStateRouter");

const rootMW = require("../middleware/rootMW");

//*************Routes*************/

router.get("/", rootMW);
//will determine the right page to navigate to when the
//user tries to set a get request for the root page

router.use("/log-in", loginRouter);
router.use("/sign-up", signupRouter);
router.use("/home", homeRouter);
router.use("/auth-state", authStateRouter);

module.exports = router;
