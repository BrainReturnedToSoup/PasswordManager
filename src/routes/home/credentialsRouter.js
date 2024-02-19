const router = require("express").Router();

const getCredentialMW = require("../../middleware/home/credentials/getCredential"),
  addCredentialMW = require("../../middleware/home/credentials/addCredential"),
  updateCredentialMW = require("../../middleware/home/credentials/updateCredential"),
  deleteCredentialMW = require("../../middleware/home/credentials/deleteCredential");

const getIdAndNameSetMW = require("../../middleware/home/credentials/getIdAndNameSet"),
  getDescriptionMW = require("../../middleware/home/credentials/getDescription"),
  getEmailUsernameMW = require("../../middleware/home/credentials/getEmailUsername"),
  getPasswordMW = require("../../middleware/home/credentials/getPassword");

router.get("/", getCredentialMW); //retrieves the entire credential set corresponding to the supplied credential ID in the query
router.post("/", addCredentialMW); //for adding new credentials to your account
router.put("/", updateCredentialMW); //for updating existing credentials with new values within your account
router.delete("/", deleteCredentialMW); //for deleting existing credentials from your account

router.get("/id-name-set", getIdAndNameSetMW); //for getting the set of ID's and names linked to the corresponding session. NOT THE ACTUAL CREDENTIALS
router.get("/description", getDescriptionMW); //for getting the description of a credential corresponding to the supplied credential ID, REQUIRES ALSO VALID SESSION
router.get("/email-username", getEmailUsernameMW);
router.get("/password", getPasswordMW);

module.exports = router;
