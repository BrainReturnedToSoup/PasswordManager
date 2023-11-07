const router = require("express").Router();
const cors = require("cors");

//*************Routes*************/
const { loginPageMW, loginPostMW } = require("../middleware/loginMW");

router.get("/", loginPageMW);

const postOptions = {
  origin: [process.env.SERVER_ORIGIN + "/log-in"],
  methods: "POST",
};
//CORS setup so that POST requests to the '/log-in' endpoint
//have to originate from a source that contains the server origin as well
//as the '/log-in' path in the url. This means that the request can only be made
//from the login page

router.post("/", cors(postOptions), loginPostMW);

module.exports = router;
