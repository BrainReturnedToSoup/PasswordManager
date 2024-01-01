const crypto = require("crypto");

function generateHex_32B() {
  return crypto.randomBytes(32).toString("hex"); // 16-22 byte hex string
}

console.log(generateHex_32B());
