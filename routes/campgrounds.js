var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
// ===========================================================

// INDEX - show all campgrounds
router.get("/", function (req, res) {
   // get all campgrounds from DB
   Campground.find({}, function (err, allCampgrounds) {
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds/index", { campgroundsGallery: allCampgrounds });
         //req.user is for showing the user's id on navbar
      }
   });
});

// CREATE - add new campground to DB
router.post("/", isLoggedIn, function (req, res) {
   // get data from form and add to campgrounds array
   var newName = req.body.nameAdded;
   var newImage = req.body.imageAdded;
   var newDescription = req.body.descriptionAdded;
   // below is another of doing the same thing we did for author in comments
   var author = {
      id: req.user._id,
      username: req.user.username
   }
   var newCampground = { name: newName, image: newImage, description: newDescription, author: author };
   // create a new campground and save to DB
   Campground.create(newCampground, function (err, newlyCreated) {
      if (err) {
         console.log(err);
      } else {
         // redirect to campgrounds page
         res.redirect("/campgrounds");
      }
   });
});

// NEW - show form to create a new campground
router.get("/new", isLoggedIn, function (req, res) {
   res.render("campgrounds/new");
});

// SHOW - show more info about the campground
router.get("/:id", function (req, res) {
   // Find the campground with that id
   Campground.findById(req.params.id)
      .populate("comments")
      .exec(function (err, foundCampground) {
         if (err) {
            console.log(err);
         } else {
            // render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
         }
      });
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect("/login");
}

module.exports = router;