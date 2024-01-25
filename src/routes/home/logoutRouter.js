const router = require("express").Router();

const handleLogoutMW = require("../../middleware/home/logoutMW");

//just for a regular logout request
router.post("/", handleLogoutMW);

module.exports = router;
