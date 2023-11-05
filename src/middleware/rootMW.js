const { verifyToken } = require("../utils/jwt");

async function handleReroute(req, res) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.redirect("/log-in");
    } //check for a token

    const resultsObj = await verifyToken(token);

    if (resultsObj.result) {
      res.redirect("/home");
      //go to the home page if the token validates sucessfully
    } else {
      res.status(401).redirect("/log-in");
      //upon failure to validate the present token, reroute to the login page
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

const rootMW = [handleReroute];

module.exports = rootMW;
