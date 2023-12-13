require("dotenv").config(); //initializes environment variables globally
require("./src/utils/authProcessApis"); //initialize the auth child process instance in the very beginning

const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080;

//***************Server-Config****************/

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
//enables form submissions to be accessible as properties in the req.body

app.use(express.static(path.join(__dirname, "src", "react-bundle")));
//for serving static assets such as scripts and stylesheets in the bundle head

//******************Routes********************/

const rootRouter = require("./src/routes/rootRouter");

app.use("/", rootRouter);

//*****************Listener*******************/

app.listen(PORT, () => {
  console.log(`Server is active, listening on port ${PORT}`);
});
