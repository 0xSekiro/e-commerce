const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID_PRODUCTOIN,
      clientSecret: process.env.GOOGLE_SECRET_PRODUCTION,
      callbackURL: process.env.CALLBACK_URL_PRODUCTION,
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ google_id: profile.id });
      if (!user) {
        user = new User({
          google_id: profile.id,
          username: profile.displayName,
        });
        await user.save({ validateBeforeSave: false });
      }
      done(null, user);
    }
  )
);
