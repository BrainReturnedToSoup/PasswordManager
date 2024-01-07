require("dotenv").config();

const { authUser, checkAuth, renewToken } = require("./jwt");

const AUTH_ENUMS = require("../enums/authProcessEnums");

//a single process messaging portal since defining along individual rules
//such as 'authUser' and 'checkAuth' etc. will limit my range of possible message
//tags to use to essentially define a line of communication between this child process
//and the main process. This also simplifies my implementation of the promise-based IPC
//communication

//the promiseID is returned in order to link each message to a promise that was made on the main process, and thus
//fulfill that promise as usual using a hash map. Overall, this ensures that the main process can interact with
//the child process just like any other asynchronous task.
async function authUserWrapper(args) {
  const { email, password, promiseID } = args;
  let result, error;

  try {
    result = await authUser(email, password);
  } catch (err) {
    error = err;
  }

  process.send({ result, promiseID, error });
}

async function checkAuthWrapper(args) {
  const { cookies, promiseID } = args;

  let result, error;

  try {
    result = await checkAuth(cookies);
  } catch (err) {
    error = err;
  }

  process.send({ result, promiseID, error });
}

async function renewTokenWrapper(args) {
  const { decodedToken, promiseID } = args;

  let result, error;

  try {
    result = renewToken(decodedToken);
  } catch (err) {
    error = err;
  }

  process.send({ result, promiseID, error });
}

//*****************EVENT-LISTENER********************* */

//the message parameter for the process is not customizable, there are only
//a set of allowed values for the message value.

process.on(AUTH_ENUMS.MESSAGE, (args) => {
  console.log("child process received message", args);

  const { rule } = args;

  switch (rule) {
    case AUTH_ENUMS.AUTH_USER:
      authUserWrapper(args);
      break;

    case AUTH_ENUMS.CHECK_AUTH:
      checkAuthWrapper(args);
      break;

    case AUTH_ENUMS.RENEW_TOKEN:
      renewTokenWrapper(args);
      break;

    default:
      console.error(
        `Child Process - Auth: Received invalid rule for as argument, received ${rule}`
      );
      process.send({ error: "invalid-auth-rule" });
  }
});
