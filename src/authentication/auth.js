const passport = require("passport");

//USER AUTHENTICATION
const authuser = (req, res, next) => {
  console.log("-------------------------authuser---------------------");
  passport.authenticate("jwt", { session: false }, (err, userdata) => {
    try {
      if (err) {
        return res.status(201).json({
          status: "invalid token",
        });
      }
      req.user = userdata.user;
      return next();
    } catch (error) {
      console.log("error from user middleware", error);
      return next();
    }
  })(req, res, next);
};

module.exports = {
  authuser,
};
