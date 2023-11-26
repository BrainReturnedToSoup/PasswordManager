const { checkAuth } = require("../utils/jwt");

async function checkAuthRoot(req, res) {
  let authResult;

  try {
    authResult = await checkAuth(req);
  } catch (error) {
    console.error(error, error.stack);
  }

  switch (authResult) {
    case "valid-token":
      res.status(200).redirect("/home");
      break;
    case "invalid-token":
      res.redirect("/log-in");
      break;
    case "validation-error":
      res.clearCookie("jwt").redirect("/log-in");
      break;
    default:
      res.status(500).json({ error: "checkAuth-root-error" });
  }
}

const rootMW = [checkAuthRoot];

module.exports = rootMW;
