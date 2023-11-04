const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const pool = require("../services/postgresql.js");

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SK,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    let connection,
      user,
      error = false;
    //prevents multiple invocations of 'done()' in the event of an error

    try {
      connection = await pool.connect();
      const result = await connection.query(
        `SELECT * FROM users WHERE user_uuid = $1`,
        [jwtPayload.user_uuid]
      );

      if (result.rowCount === 1) {
        user = result.rows[0];
      } else {
        throw new Error("User not found");
        //handled by the catch block
      }
    } catch (error) {
      error = true;
      done(error, false);
    } finally {
      if (connection) {
        connection.release();
      }
      //ensures that any connection that is made is released before declaring a done operation

      if (user && !error) {
        done(null, user);
      }
      //only returns done if the user object
      //is not undefined and if an error did not occur
    }
  })
);

module.exports = passport;
//provide a single instance that can be imported into the necessary files
//instance was created in order to implement load order for passport in said
//server file
