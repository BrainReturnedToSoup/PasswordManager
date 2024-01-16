const { JWT_RESPONSE_TYPE } = require("../../enums/jwtEnums");
const auth = require("../../services/authProcessApis");

//*****************AUTH******************/

async function validateAuth(req, res, next) {
  //if the jwt cookie does not exist, then obviously not authenticated
  if (!req.cookies.jwt) {
    res.status(400).json({ success: false, auth: false });
    return;
  }

  let result, error;

  try {
    result = await auth.checkAuth(req.cookies.jwt); //doesn't throw errors, will only return flags.
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(
      "AUTH STATE VALIDATION: validateAuth - auth state POST catch block",
      error,
      error.stack
    );
    res.status(400).json({ success: false, auth: false, error });
    return;
  }

  if (result.type === JWT_RESPONSE_TYPE.ERROR) {
    res.status(400).json({ success: false, auth: false, error: result.error });
    return;
  }

  next();
}

//******************GET******************/

//specific endpoint get the corresponding credential IDs and their names for all present credentials, but
//not the actual credential information.

function getIdNameSet(req, res) {}

const homeGetIdNameSetMW = [validateAuth, getIdNameSet];

//specific endpoint to retrieve the actual credentials corresponding to the credential box on the screen.
//This information is requested by clicking on a view button, which doesn't require storing any credentials
//in client state itself, just their IDs that normalize to the information on the server

function getCredentialPair(req, res) {}

const homeGetCredentialPairMW = [validateAuth, getCredentialPair];

//*****************POST******************/

//takes the credential parameters such as email and password, and adds them
//to the db linked to the corresponding user.
//Creates a new credential ID corresponding to the specific new pair.
function addNewCreds(req, res) {}

const homePostAddNewCredsMW = [validateAuth, addNewCreds];

//takes the credential parameters such as email and password, and overwrites the
//corresponding credentials already in the db linked to the corresponding user.
//used the credential ID to locate the corresponding credentials
function updateExistingCreds(req, res) {}

const homePostUpdateExistingCredsMW = [validateAuth, updateExistingCreds];

//completely deletes the corresponding credentials, utilizing the credential ID
//as the identifier for the information
function deleteExistingCreds(req, res) {}

const homePostDeleteExistingCredsMW = [validateAuth, deleteExistingCreds];

module.exports = {
  homeGetIdNameSetMW,
  homeGetCredentialPairMW,
  homePostAddNewCredsMW,
  homePostUpdateExistingCredsMW,
  homePostDeleteExistingCredsMW,
};
