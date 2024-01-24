const JWT_ERROR = Object.freeze({
  INVALID_CREDS: "invalid-credentials",
  INVALID_TOKEN: "invalid-token",

  SESSION_CREATION_FAILURE: "session-creation-failure",
  SESSION_TERMINATION_FAILURE: "session-termination-failure",
  VALIDATION_ERROR: "validation-error",
  USER_NOT_FOUND: "user-not-found",

  INVALID_JTI: "invalid-jti",
  JTI_UPDATE_FAILURE: "jti-update-failure",
  TOKEN_RENEW_FAILURE: "token-renew-failure"
});

module.exports = { JWT_ERROR };
