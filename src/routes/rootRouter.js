const router = require("express").Router();

//**************Routes****************/
const rootMW = require("../middleware/rootMW");

router.get("/", rootMW);
//will determine the right page to navigate to when the
//user tries to set a get request for the root page

module.exports = router;
