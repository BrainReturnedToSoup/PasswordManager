const { checkAuth } = require("../utils/jwt");

//******************GET******************/

async function checkCurrentAuthState(req, res) {
  let result;

  try {
    result = await checkAuth(req);
  } catch (error) {
    console.error("auth validation login", error, error.stack);
  }

  switch (result) {
    case "no-token":
      res.status(200).json({ auth: false });
      break;
    case "valid-token":
      res.status(500).json({ auth: true });
      break;
    case "invalid-token":
      res.status(200).json({ auth: false });
      break;
    case "validation-error":
      res.status(500).json({ auth: false, error: "validation-error" });
      break;
    default:
      console.error("LOG-IN ERROR: validateAuthLoginPost function error");
      res.status(500).json({ error: "validateAuthLoginPost-error" });
  }
}

const authStateMW = [checkCurrentAuthState];

module.exports = authStateMW;
