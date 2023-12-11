const crypto = require("crypto");

//***************Sym-Key-Generation***************/

//creates a completely random symmetric key upon launching the server
function initTokenSymmetricKey() {
  const symmetricKey = crypto.randomBytes(32).toString("hex"); //for AES256;

  process.env.TOKEN_SYMMETRIC_KEY = symmetricKey;
}
//initialize it as early as possible

//*****************Hex-Generation*****************/

function generateHex_16B() {
  return crypto.randomBytes(16).toString("hex"); // 16-22 byte hex string
}

//*****************IV-Management******************/

//Managest JTI-IV relationships, as the JTI of a current valid token is not only necessary
//for making sure that a token cannot be used more than once, but also to keep track of the
//associated IV required to decrypt the user's UUID that is stored on the JWT token payload as well
class TokenSessionManager {
  #JTI_to_hexIV = new Map();
  #hexIV_to_JTI = new Map();
  #hexIV_to_setTimeout = new Map();

  //creates key value pair in the IV map, where the IV is the key, and the value is the JTI which is
  //set to null until defined using the updateExistingJTI method below. A setTimeout to delete the possible pairs
  //within both maps corresponding to the IV will be created as well.
  createSession(startingJTI, hexIV) {
    try {
      if (this.#hexIV_to_JTI.has(hexIV)) {
        console.error(
          `Failed to create session, supplied IV already exists within hexIV_to_JTI`
        );

        return null;
      }

      if (this.#JTI_to_hexIV.has(startingJTI)) {
        console.error(
          `Failed to create session, supplied JTI already exists within JTI_to_hexIV`
        );

        return null;
      }

      this.#hexIV_to_JTI.set(hexIV, startingJTI);
      this.#JTI_to_hexIV.set(startingJTI, hexIV);

      const timeout = setTimeout(() => {
        const currentJTI = this.#hexIV_to_JTI.get(hexIV);

        this.#JTI_to_hexIV.delete(currentJTI);
        this.#hexIV_to_JTI.delete(hexIV);
        this.#hexIV_to_setTimeout.delete(hexIV);
      }, parseInt(process.env.JWT_EXP_SECONDS) * 1000);

      this.#hexIV_to_setTimeout.set(hexIV, timeout);

      return true;
    } catch (error) {
      console.error(`createSession: ${error}`);
    }
  }

  //terminates an existing session manually, which is important for things such as logging out
  terminateSession(currentJTI) {
    try {
      const corresIV = this.#JTI_to_hexIV.get(currentJTI);

      if (!corresIV) {
        console.error(
          `Failed to terminate session, supplied JTI does not exist within JTI_to_hexIV`
        );

        return null;
      }

      const timeout = this.#hexIV_to_setTimeout.get(corresIV);
      clearTimeout(timeout);
      //get rid of the automatic termination if you are manually terminating the session

      this.#JTI_to_hexIV.delete(currentJTI);
      this.#hexIV_to_setTimeout.delete(corresIV);
      this.#hexIV_to_JTI.delete(corresIV);

      return true;
    } catch (error) {
      console.error(`terminateSession: ${error}`);
    }
  }

  //updates the JTI corresponding to the IV, which is done by looking up the key value in the IV
  //map, and either updating or creating the corresponding pair in the JTI map as well as updating the IV map
  //to reflect the relationship.
  updateExistingJTI(oldJTI, newJTI) {
    try {
      const hexIV = this.#JTI_to_hexIV.get(oldJTI);

      if (!hexIV) {
        console.error(
          `Failed to update existing JTI, supplied IV does not exist within hexIV_to_JTI `
        );

        return null;
      }

      this.#JTI_to_hexIV.delete(oldJTI);
      this.#JTI_to_hexIV.set(newJTI, hexIV);
      this.#hexIV_to_JTI.set(hexIV, newJTI);

      return true;
    } catch (error) {
      console.error(`updateExistingJTI: ${error}`);
    }
  }

  //simple getter for checking if the current jti exists within the session manager
  hasJti(jti) {
    return this.#JTI_to_hexIV.has(jti);
  }
}

//******************AES256******************/

function encryptData(uuidString) {
  try {
    const newHexIV = generateHex_16B(),
      newIVBuffer = Buffer.from(newHexIV, "hex"),
      uuidBuffer = Buffer.from(uuidString, "utf-8");
    //buffers are a binary data format that is required for AES256

    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      process.env.TOKEN_SYMMETRIC_KEY, //this uses a string though
      newIVBuffer
    );

    //encrypted usually in blocks, but this implementation will encrypt
    //the data in its entirety all at once
    const encryptedData = Buffer.concat([
      cipher.update(uuidBuffer),
      cipher.final(),
    ]);

    //the encrypted data is still in binary data format, so we can
    //convert this data to base64, which is essentially the string
    //representation of said binary data
    const encryptedString = encryptedData.toString("base64");

    return { encryptedString, newHexIV };
  } catch (error) {
    console.error(`encryptData: ${error}`);
  }
}

//basically just work backwards to decrypt
function decryptData(sessionManager, encryptedString, JTI) {
  try {
    const encryptedData = Buffer.from(encryptedString, "base64");

    const hexIV = sessionManager.retrieveIV(JTI),
      IVBuffer = Buffer.from(hexIV, "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      process.env.TOKEN_SYMMETRIC_KEY,
      IVBuffer
    );

    const decryptedData = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    const decryptedUUIDString = decryptedData.toString("utf-8");

    return decryptedUUIDString;
  } catch (error) {
    console.error(`decryptData: ${error}`);
  }
}

//**************Init-Session-Manager***************/

module.exports = {
  TokenSessionManager,
  encryptData,
  decryptData,
  initTokenSymmetricKey,
};
