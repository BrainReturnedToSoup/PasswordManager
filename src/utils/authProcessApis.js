const { fork } = require("child_process");
const { v4: uuid } = require("uuid");

class Auth {
  constructor() {
    this.process;
    this.promiseManager = new Map();
    this.promiseTimeout = new Map();

    this.#initProcessListener();
  }

  #initProcessListener() {
    this.process = fork("../auth/authProcess.js");

    this.process.on("auth", (args) => {
      this.#processMessage(args);
    });
  }

  #processMessage(args) {
    const { result, promiseID } = args,
      { resolve } = this.promiseManager.get(promiseID);

    resolve(result);
    //all responses from the child process counts as a success, even if the message is an error

    this.promiseManager.delete(promiseID);
    this.promiseTimeout.delete(promiseID);
  }

  async #createPromise(promiseID) {
    return new Promise((resolve, reject) => {
      this.promiseManager.set(promiseID, { resolve, reject });

      const promiseTimeout = setTimeout(() => {
        this.promiseManager.delete(promiseID);

        reject(); //reject the promise before deleting the timeout instance

        this.promiseTimeout.delete(promiseID);
      }, 20000); //reject the promise after 20 seconds automatically

      this.promiseTimeout.set(promiseID, promiseTimeout);
    });
  }

  async authUser(email, password) {
    const promiseID = uuid(),
      promise = this.#createPromise(promiseID);

    this.process.send("auth", { rule: "authUser", email, password, promiseID });

    return promise;
  }

  async checkAuth(cookies) {
    const promiseID = uuid(),
      promise = this.#createPromise(promiseID);

    this.process.send("auth", { rule: "checkAuth", cookies, promiseID });

    return promise;
  }

  async renewToken(decodedToken) {
    const promiseID = uuid(),
      promise = this.#createPromise(promiseID);

    this.process.send("auth", { rule: "renewToken", decodedToken, promiseID });

    return promise;
  }
}
