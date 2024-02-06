const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControlller = require("../controller/users.js")
router.get("/signup", userControlller.renderSingupForm);

router.post(
  "/signup",
  wrapasync(userControlller.signup)
);

// login
router.get("/login", userControlller.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControlller.login
);

// logout
router.get("/logout",userControlller.logout)
module.exports = router;
