const { validateAuth } = require("./common/auth");
const { errorResponse } = require("./common/errorResponse");

const pool = require("../../../services/postgresql.js");

const cookieOptions = {
  secure: true, //the cookie is only sent over https
  httpOnly: true, //prevents client side JS from accessing the cookie
  sameSite: "Strict", //prevents requests from different origins from using the cookie
};

async function getIdAndNameSet(req, res, next) {
  const { uuid } = req.checkAuth;

  let connection, result, error;

  try {
    connection = await pool.connect();

    result = await connection.query(
      `
        SELECT 
          credential_id,
          credential_name
        FROM credentials
        WHERE user_uuid = $1
        ORDER BY credential_name DESC
        `,
      [uuid]
    );
  } catch (err) {
    console.error(`getIdAndNameSet catch block: ${err} ${err.stack}`);
    error = err;
  } finally {
    if (connection) {
      connection.done();
    } //always release the connection as soon as possible
  }

  if (error) {
    errorResponse(req, res, 500, error);
    return;
  }

  req.idAndNameSet = result;

  next();
}

function renewToken(req, res) {
  const { newToken } = req.checkAuth,
    { idAndNameSet } = req;

  res
    .status(200)
    .cookie("jwt", newToken, cookieOptions)
    .json({ success: true, idAndNameSet });
}

const getIdAndNameSetMW = [validateAuth, getIdAndNameSet, renewToken];

module.exports = getIdAndNameSetMW;
