const router = require("express").Router();

const logoutPostMW = require("../../middleware/home/logoutMW");

//just for a regular logout request
router.post("/", logoutPostMW);

module.exports = router;
