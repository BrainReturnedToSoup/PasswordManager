const router = require("express").Router();

const getCredentialMW = require("../../middleware/home/credentials/getCredential"),
  addCredentialMW = require("../../middleware/home/credentials/addCredential"),
  updateCredentialMW = require("../../middleware/home/credentials/updateCredential"),
  deleteCredentialMW = require("../../middleware/home/credentials/deleteCredential");

const getIdAndNameSetMW = require("../../middleware/home/credentials/getIdAndNameSet");

router.get("/", getCredentialMW); //for getting the actual credential pair corresponding to the credential ID
router.post("/", addCredentialMW); //for adding new credentials to your account
router.put("/", updateCredentialMW); //for updating existing credentials with new values within your account
router.delete("/", deleteCredentialMW); //for deleting existing credentials from your account

router.get("/id-name-set", getIdAndNameSetMW); //for getting the set of ID's and names linked to the corresponding session. NOT THE ACTUAL CREDENTIALS

module.exports = router;
