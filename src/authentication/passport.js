var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const usermodel = require("../model/userModel");
const passport = require("passport");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    if (jwt_payload.id) {
      usermodel.findOne({ _id: jwt_payload.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          const userdata = { user };
          return done(null, userdata);
        } else {
          return done(null, false);
        }
      });
    }
  })
);
