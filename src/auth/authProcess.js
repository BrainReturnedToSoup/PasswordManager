const { authUser, checkAuth, renewToken } = require("./jwt");

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
