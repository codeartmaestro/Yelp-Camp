/* We could've called it "auth.js" but index.js is seen often for the all-purpose routes that aren't related to a particular model - here we have landing route "/" and authentication routes */
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
// ===========================================================

// root route
router.get("/", function (req, res) {
   res.render("landing");
});

// show register form
router.get("/register", function (req, res) {
   res.render("register");
});

// handle sign up logic
router.post("/register", function (req, res) {
   var newUser = new User({ username: req.body.username });
   User.register(newUser, req.body.password, function (err, user) {
      if (err) {
         req.flash("error", err.message);
         return res.redirect("register");
      }
      passport.authenticate("local")(req, res, function () {
         req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
         res.redirect("/campgrounds");
      });
   });
});

// show login form
router.get("/login", function (req, res) {
   res.render("login");
});

// handle login logic
// app.post("/login", middleware, callback)
router.post(
   "/login",
   passport.authenticate("local", { successRedirect: "/campgrounds", failureRedirect: "/login", failureFlash: true }),
   function (req, res) { }
);

// logout rout
router.get("/logout", function (req, res) {
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

module.exports = router;
