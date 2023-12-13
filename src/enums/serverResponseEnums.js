const SERVER_RESPONSE = Object.freeze({
  ALREADY_AUTHED: "already-authenticated",
  CONSTR_VALIDATION_FAILURE: "constraint-validation-failure",
  DB_ERROR: "db-error",
  EXISTING_USER: "existing-user",
  USER_AUTH_FAILURE: "user-auth-failure",

  REDIRECT_HOME: "/home",
});

module.exports = SERVER_RESPONSE;
