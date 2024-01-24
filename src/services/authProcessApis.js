const { fork } = require("child_process"),
  path = require("path"); //for proper module fork directory

const { v4: uuid } = require("uuid");

const AUTH_ENUMS = require("../enums/authProcessEnums");

const promiseTimeoutMs = 20000;

class Auth {
  constructor() {
    this.childProcess;
    this.promiseManager = new Map();
    this.promiseTimeout = new Map();
  }

  //creates a promise that the child process will eventually return a message
  //based on a request to do a certain action. The individual promises are resolved
  //because the request supplies a promise ID that the child process will send back
  //in its message.
  #createResponsePromise() {
    const promiseID = uuid();

    const promise = new Promise((resolve, reject) => {
      this.promiseManager.set(promiseID, { resolve, reject });

      const promiseTimeout = setTimeout(() => {
        reject(AUTH_ENUMS.REJECT_TIMEOUT); //reject the promise before deleting the timeout instance
        this.promiseManager.delete(promiseID);
        this.promiseTimeout.delete(promiseID);

        console.error(`IPC PROMISE TIMEOUT: a promise for an action to be taken by 
        the Authentication child process timed out before receiving a response, promiseID: ${promiseID}`);
      }, promiseTimeoutMs); //reject the promise after 20 seconds automatically

      this.promiseTimeout.set(promiseID, promiseTimeout);
    });

    console.log("main to child-process promise created", promiseID);

    return { promise, promiseID };
  }

  #processMessage(res) {
    const { result, promiseID, error } = res,
      { resolve, reject } = this.promiseManager.get(promiseID);

    error ? reject(error) : resolve(result); //all responses from the child process counts as a success, even if the message is an error

    const corresTimeout = this.promiseTimeout.get(promiseID);
    clearTimeout(corresTimeout);

    this.promiseManager.delete(promiseID);
    this.promiseTimeout.delete(promiseID);

    console.log("main to child-process promise resolved", promiseID);
  }

  #sendMessage(payload) {
    try {
      this.childProcess.send(payload);
    } catch (error) {
      console.error("Auth child process messaging failure", error, error.stack);
    }
  }

  //a single listener portal for the messages send back from the child process to
  //use after processing some sort of action
  initProcessListener() {
    if (!this.childProcess) {
      const parentDir = path.join(__dirname, ".."),
        modulePath = path.join(parentDir, "auth", "process.js");

      this.childProcess = fork(modulePath, { execArgv: ["--inspect"] }); //forking is async

      this.childProcess.on(AUTH_ENUMS.MESSAGE, (res) => {
        this.#processMessage(res);
      });
    }
  }

  authUser(email, password) {
    const { promise, promiseID } = this.#createResponsePromise();
    this.#sendMessage({
      rule: AUTH_ENUMS.AUTH_USER,
      email,
      promiseID,
      password,
    });

    return promise;
  }

  deauthUser(jwtToken) {
    const { promise, promiseID } = this.#createResponsePromise();
    this.#sendMessage({ rule: AUTH_ENUMS.DEAUTH_USER, promiseID, jwtToken });

    return promise;
  }

  checkAuth(jwtToken) {
    const { promise, promiseID } = this.#createResponsePromise();
    this.#sendMessage({ rule: AUTH_ENUMS.CHECK_AUTH, promiseID, jwtToken });

    return promise;
  }
}

//create a single auth instance in the case of this server's needs
const auth = new Auth();
auth.initProcessListener();

module.exports = auth;
