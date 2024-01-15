const serveBundle = require("../utils/serveBundle");
const { JWT_RESPONSE_TYPE } = require("../enums/jwtEnums");

//******************GET******************/

const homeGetMW = [serveBundle];

//*****************POST******************/

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
    res.status(400).json({ success: false, auth: false });
    return;
  }

  if (result.type === JWT_RESPONSE_TYPE.ERROR) {
    res.status(400).json({ success: false, auth: false });
    return;
  }

  next();
}

//for handling a request containing settings related values and configurations
//and then updating the configurations in the DB corresponding to the user
function handleNewSettings(req, res) {
    
}

const homePostSettingsMW = [validateAuth, handleNewSettings];

//for handling a request containing a new credential to add to the DB
//and thus will be available for display on the client
function handleNewCreds(req, res) {}

const homePostNewCredsMW = [validateAuth, handleNewCreds];

module.exports = { homeGetMW, homePostNewCredsMW, homePostSettingsMW };
