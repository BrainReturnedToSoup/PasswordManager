require("dotenv").config(); //initializes environment variables globally
require("./src/services/postgresql");
require("./src/services/authProcessApis"); //initialize the auth child process instance in the very beginning but after the DB pool

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser");

const app = express(),
  PORT = 8080;

//***************Server-Config****************/

app.use(bodyParser.json()); //parse any reqeust body as JSON
app.use(cookieParser()); //request includes cookies automatically

app.use(express.urlencoded({ extended: true }));
//enables form submissions to be accessible as properties in the req.body

app.use(express.static(path.join(__dirname, "src", "client-bundle"))); //index.html file

//**************JS-Client-Modules*************/

app.use(express.static(path.join(__dirname, "immutable", "chunks")));
app.use(express.static(path.join(__dirname, "immutable", "entry")));
app.use(express.static(path.join(__dirname, "immutable", "nodes")));
//for serving static assets such as scripts and stylesheets associated with the index.html file

//******************Routes********************/

const rootRouter = require("./src/routes/rootRouter");

app.use("/", rootRouter);

//*****************Listener*******************/

app.listen(PORT, () => {
  console.log(`Server is active, listening on port ${PORT}`);
});
