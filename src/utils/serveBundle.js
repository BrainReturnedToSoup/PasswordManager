const path = require("path"),
  fs = require("fs/promises");

async function serveBundle(req, res) {
  const parentDir = path.join(__dirname, ".."),
    bundlePath = path.join(parentDir, "client-bundle", "index.html");

  //have to read the file, and then send the parsed index.html file
  //to the user, this operation is normally async
  try {
    const htmlFile = await fs.readFile(bundlePath);

    res.setHeader("Content-Type", "text/html");
    res.send(htmlFile);
  } catch (error) {
    console.error("SERVE BUNDLE ERROR: serveBundle catch block", error);

    res.status(500).send({ error: "bundle serving error" });
  }
}

module.exports = serveBundle;
