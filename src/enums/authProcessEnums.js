const AUTH_ENUMS = Object.freeze({
  MESSAGE: "message",
  REJECT_TIMEOUT: "auth-child-process-promise-timed-out",

  AUTH_USER: "authUser",
  DEAUTH_USER: "deauthUser",
  CHECK_AUTH: "checkAuth",
  RENEW_TOKEN: "renewToken",
});

module.exports = AUTH_ENUMS;
