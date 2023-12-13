const JWT_ERROR = Object.freeze({
  INVALID_CREDS: "invalid-credentials",
  INVALID_TOKEN: "invalid-token",

  SESSION_CREATION_FAILURE: "session-creation-failure",
  VALIDATION_ERROR: "validation-error",
  USER_NOT_FOUND: "user-not-found",

  INVALID_JTI: "invalid-jti",
  JTI_UPDATE_FAILURE: "jti-update-failure",
});

const JWT_RESPONSE = Object.freeze({
  TYPE_ERROR: "error",
  TYPE_TOKEN: "token",
  TYPE_VALID: "valid",
});

module.exports = { JWT_ERROR, JWT_RESPONSE };
