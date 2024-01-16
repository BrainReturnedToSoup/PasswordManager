const router = require("express").Router();

const {
  homeGetIdNameSetMW,
  homeGetCredentialPairMW,
  homePostAddNewCredsMW,
  homePostUpdateExistingCredsMW,
  homePostDeleteExistingCredsMW,
} = require("../../middleware/home/credentialsMW");

//*************Routes*************/

router.get("/id-name-set", homeGetIdNameSetMW); //for getting only the credential ID and high level name, as the credential data isn't stored on the client
router.get("/pair", homeGetCredentialPairMW); //for getting the actual credential pair corresponding to the credential ID

router.post("/new", homePostAddNewCredsMW); //for adding new credentials to your account
router.post("/update", homePostUpdateExistingCredsMW); //for updating existing credentials with new values within your account
router.post("/delete", homePostDeleteExistingCredsMW); //for deleting existing credentials from your account

module.exports = router;
