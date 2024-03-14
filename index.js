import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import MongoStore from "connect-mongo";

import dbConfig from "./db.config.js";
import { signupRoute } from "./routes/register.js";
import { signinRoute } from "./routes/login.js";

import passport from "passport";
import session from "express-session";

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/passportLocal",
    }),
  })
);
app.use(passport.authenticate("session"));
app.use(passport.session());
app.use("/auth", signupRoute);
app.use("/auth", signinRoute);

app.get("/", (req, res) => {
  console.log(req.isAuthenticated());
  return res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
});

dbConfig(() => {
  app.listen(3000, () => {
    console.log("app running at port 3000");
  });
});
