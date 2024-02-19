const router = require("express").Router();

const handleLogoutMW = require("../../middleware/home/logoutMW");

router.post("/", handleLogoutMW); //just for a regular logout request

module.exports = router;
