const serveBundle = require("../routes/_common/serveBundle");

//******************GET******************/

const rootMW = [serveBundle];

module.exports = rootMW;
