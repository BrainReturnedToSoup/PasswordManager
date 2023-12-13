const { fork } = require("child_process");
const { v4: uuid } = require("uuid");

const AUTH_ENUMS = require("../enums/authProcessEnums");

class Auth {
  constructor() {
    this.process;
    this.promiseManager = new Map();
    this.promiseTimeout = new Map();

    this.#initProcessListener();
  }

  //a single listener portal for the messages send back from the child process to
  //use after processing some sort of action
  #initProcessListener() {
    this.process = fork("../auth/authProcess.js");

    this.process.on(AUTH_ENUMS.MESSAGE, (res) => {
      this.#processMessage(res);
    });
  }

  #processMessage(res) {
    const { result, promiseID } = res,
      { resolve } = this.promiseManager.get(promiseID);

    resolve(result);
    //all responses from the child process counts as a success, even if the message is an error

    this.promiseManager.delete(promiseID);
    this.promiseTimeout.delete(promiseID);
  }

  //creates a promise that the child process will eventually return a message
  //based on a request to do a certain action. The individual promises are resolved
  //because the request supplies a promise ID that the child process will send back
  //in its message.
  async #createResponsePromise() {
    const promiseID = uuid();

    const promise = new Promise((resolve, reject) => {
      this.promiseManager.set(promiseID, { resolve, reject });

      const promiseTimeout = setTimeout(() => {
        this.promiseManager.delete(promiseID);

        reject(AUTH_ENUMS.REJECT_TIMEOUT); //reject the promise before deleting the timeout instance

        console.error(`IPC PROMISE TIMEOUT: a promise for an action to be taken by 
        the Authentication child process timed out before receiving a response, promiseID: ${promiseID}`);

        this.promiseTimeout.delete(promiseID);
      }, 20000); //reject the promise after 20 seconds automatically

      this.promiseTimeout.set(promiseID, promiseTimeout);
    });

    return { promise, promiseID };
  }

  #sendMessage(payload) {
    this.process.send(AUTH_ENUMS.MESSAGE, payload);
  }

  async authUser(email, password) {
    const { promise, promiseID } = this.#createResponsePromise();
    this.#sendMessage({
      rule: AUTH_ENUMS.AUTH_USER,
      email,
      promiseID,
      password,
    });

    return promise;
  }

  async checkAuth(cookies) {
    const { promise, promiseID } = this.#createResponsePromise();
    this.#sendMessage({ rule: AUTH_ENUMS.CHECK_AUTH, promiseID, cookies });

    return promise;
  }

  async renewToken(decodedToken) {
    const { promise, promiseID } = this.#createResponsePromise();
    this.#sendMessage({
      rule: AUTH_ENUMS.RENEW_TOKEN,
      promiseID,
      decodedToken,
    });

    return promise;
  }
}

//create a single auth instance in the case of this server's needs
const auth = new Auth();
module.exports = auth;
