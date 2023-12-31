require("dotenv").config(); //initializes environment variables globally
require("./src/utils/authProcessApis"); //initialize the auth child process instance in the very beginning

const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");

const app = express(),
  PORT = 8080;

//***************Server-Config****************/

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
//enables form submissions to be accessible as properties in the req.body

app.use(express.static(path.join(__dirname, "src", "client-bundle"))); //index.html FILE

//**************JS-Client-Modules*************/

app.use(express.static(path.join(__dirname, "immutable", "chunks")));
app.use(express.static(path.join(__dirname, "immutable", "entry")));
app.use(express.static(path.join(__dirname, "immutable", "nodes")));
//for serving static assets such as scripts and stylesheets in the html file head

//******************Routes********************/

const rootRouter = require("./src/routes/rootRouter");

app.use("/", rootRouter);

//*****************Listener*******************/

app.listen(PORT, () => {
  console.log(`Server is active, listening on port ${PORT}`);
});
