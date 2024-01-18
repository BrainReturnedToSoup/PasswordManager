const SERVER_RESPONSE = Object.freeze({
  ALREADY_AUTHED: "already-authenticated",
  CONSTR_VALIDATION_FAILURE: "constraint-validation-failure",
  DB_ERROR: "db-error",
  EXISTING_USER: "existing-user",
  USER_AUTH_FAILURE: "user-auth-failure",
  ADD_USER_FAILURE: "add-user-failure",
  VALIDATE_AUTH_FAILURE: "validate-auth-failure",
  USER_NOT_FOUND: "user-not-found",
  NO_AUTH_COOKIE: "no-auth-cookie",
  INVALID_CREDS: "invalid-credentials",
});

module.exports = SERVER_RESPONSE;
