const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL:
        "https://e-commerce-9w3i.onrender.com/api/v1/auth/google/callback",
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
