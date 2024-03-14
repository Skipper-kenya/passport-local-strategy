import { Router } from "express";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
const router = Router();

import passport from "passport";
import LocaStrategy from "passport-local";

const LocalStrategy = LocaStrategy.Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userModel.findOne({ username });

      if (!user) {
        return done(null, false);
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  const getUserById = await userModel.findById({ _id: id });
  done(null, getUserById);
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

export { router as signinRoute };
