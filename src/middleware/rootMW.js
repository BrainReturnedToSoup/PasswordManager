const { checkAuth } = require("../utils/jwt");

function checkAuthRoot(req, res) {
  const { result } = checkAuth(req);

  switch (result) {
    case "valid":
      res.status(200).redirect("/home");
      break;
    case "invalid":
      res.status(200).redirect("/log-in");
      break;
    case "error":
      res.status(200).redirect("/log-in");
      break;
  }
}

const rootMW = [checkAuthRoot];

module.exports = rootMW;
