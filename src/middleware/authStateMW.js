const auth = require("../services/authProcessApis");

const OUTBOUND_RESPONSE = require("../enums/serverResponseEnums");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

//******************GET******************/

//validate the token that is stored in the cookie, which involves checking
//session validity, cryptographic operations, and comparing data that exists within
//the token to what is within the DB
async function validateAuth(req, res, next) {
  if (!req.cookies.jwt) {
    res.status(200).json({ success: true, auth: false });
    return;
  } //if there isn't a jwt cookie, then obviously not authed

  let result,
    error,
    retries = 0;

  //RETRY MECHANISM
  do {
    retries++;

    try {
      result = await auth.checkAuth(req.cookies.jwt);
    } catch (err) {
      console.error(
        `authStateMW: validateAuth catch block: ${err} ${err.stack}`
      );
      error = err;
    }
  } while (!result.success && retries < 2);

  //native error in the main thread, or native or process error within the child thread
  if (error || !result.success) {
    res
      .status(500)
      .json({ success: false, error: OUTBOUND_RESPONSE.VALIDATE_AUTH_FAILURE });
    return;
  }

  //if some type of data error occurred or the session has expired
  if ((result.success && "error" in result) || !result.auth) {
    res.status(500).json({ success: true, auth: false });
    return;
  }

  //pass the new token in the req to be used next
  req.newToken = result.newToken;

  //up to this point means the session is still true
  next();
}

//sending the new token to use for the next successful request
function sendToken(req, res) {
  const { newToken } = req; //put the auth token in cookies, and give the thumbs up to the user

  res
    .status(200)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true, auth: true });
}

const getAuthStateMW = [validateAuth, sendToken];

module.exports = getAuthStateMW;
