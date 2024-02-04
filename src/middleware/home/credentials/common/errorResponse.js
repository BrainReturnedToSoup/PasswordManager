const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

function errorResponse(req, res, status, error) {
  const { newToken } = req.checkAuth;

  res
    .status(status)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: false, error });
}

module.exports = { errorResponse };
