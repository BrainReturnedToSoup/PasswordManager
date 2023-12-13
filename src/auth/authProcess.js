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
process.on(AUTH_ENUMS.MESSAGE, async (args) => {
  const { rule } = args;
  let result;

  switch (rule) {
    case AUTH_ENUMS.AUTH_USER:
      const { email, password, promiseID } = args;
      result = await authUser(email, password);
      process.send(AUTH_ENUMS.MESSAGE, { result, promiseID });
      break;

    case AUTH_ENUMS.CHECK_AUTH:
      const { cookies } = args;
      result = await checkAuth(cookies);
      process.send(AUTH_ENUMS.MESSAGE, { result, promiseID });
      break;

    case AUTH_ENUMS.RENEW_TOKEN:
      const { decodedToken } = args;
      result = renewToken(decodedToken);
      process.send(AUTH_ENUMS.MESSAGE, { result, promiseID });
      break;

    default:
      console.error(
        `Child Process - Auth: Received invalid rule for as argument, received ${rule}`
      );
      process.send(AUTH_ENUMS.MESSAGE, { result: "invalid-rule" });
  }
});
