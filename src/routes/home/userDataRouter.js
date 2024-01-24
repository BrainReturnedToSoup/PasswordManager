const router = require("express").Router();

const { getUserData } = require("../../middleware/home/userDataMW");

//defining the newest set of settings linked to a users account
router.get("/user-data", getUserData);

module.exports = router;
