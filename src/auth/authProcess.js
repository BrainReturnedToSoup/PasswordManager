const { authUser, checkAuth, renewToken } = require("./jwt");

//a single process messaging portal since defining along individual rules
//such as 'authUser' and 'checkAuth' etc. will limit my range of possible message
//tags to use to essentially define a line of communication between this child process
//and the main process. This also simplifies my implementation of the promise-based IPC
//communication

//the promiseID is returned in order to link each message to a promise that was made on the main process, and thus
//fulfill that promise as usual using a hash map. Overall, this ensures that the main process can interact with
//the child process just like any other asynchronous task.
process.on("auth", async (args) => {
  const { rule } = args;
  let result;

  switch (rule) {
    case "authUser":
      const { email, password, promiseID } = args;
      result = await authUser(email, password);
      process.send("auth", { result, promiseID });
      break;

    case "checkAuth":
      const { cookies } = args;
      result = await checkAuth(cookies);
      process.send("auth", { result, promiseID });
      break;

    case "renewToken":
      const { decodedToken } = args;
      result = renewToken(decodedToken);
      process.send("auth", { result, promiseID });
      break;

    default:
      console.error(
        `Child Process - Auth: Received invalid rule for as argument, received ${rule}`
      );
      process.send("auth", { result: "Error" });
  }
});
