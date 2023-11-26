require("dotenv").config(); //initializes environment variables globally
const path = require("path");

const express = require("express");
const app = express();

const PORT = 9229;

const cookieParser = require("cookie-parser");

//***************Server-Config****************/

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
//enables form submissions to be accessible as properties in the req.body

app.use(express.static(path.join(__dirname, "src", "react-bundles", "home")));
app.use(
  express.static(path.join(__dirname, "src", "react-bundles", "log-in-sign-up"))
);
//so that when I serve index.html files for the bundles, the head of each document
//can make more requests for static assets such as JS and CSS files

//******************Routes********************/

const rootRouter = require("./src/routes/rootRouter"),
  loginRouter = require("./src/routes/loginRouter"),
  signupRouter = require("./src/routes/signupRouter"),
  homeRouter = require("./src/routes/homeRouter");

app.use("/", rootRouter);
//will check for a web token and decide whether to reroute to
//the home page or to the login page.

app.use("/log-in", loginRouter);
//will check for a web token and decide whether to reroute to the
//home page. POST end points will be for user authentication
//and will supply web tokens upon success.

//CORS will be used in order to only allow POST requests
//from request sources that start with 'https://www.url.com/log-in'

app.use("/sign-up", signupRouter);
//will check for a web token and decide whether to reroute to the
//home page or login page. Will validate whether a user with the
//assigned email already exists or not.

//CORS will be used in order to only allow POST requests
//from request sources that start with 'https://www.url.com/sign-up'

// app.use("/home", homeRouter);
//will be a web page that is a react SPA. Will provide a
//GUI for interacting with all of the corresponding users credentials.
//Also features client side routes for things such as settings, etc.

//CORS will be used in order to only allow POST requests
//from request sources that start with 'https://www.url.com/home'
//This way you can only make requests to the protected endpoints if
//you have a valid web token that allows a successful response for
//a GET request using the same url. This GET request returns the
//React SPA corresponding to the home page

//*****************Listener*******************/

app.listen(PORT, () => {
  console.log(`Server is active, listening on port ${PORT}`);
});
