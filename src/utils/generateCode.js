//generate a string of random numbers which combine into a random code
function generateCode(codeLength = 6) {
  let code = "";

  for (let i = 0; i < codeLength; i++) {
    code += Math.floor(Math.random() * 10);
  }

  return code;
}

module.exports = generateCode;
