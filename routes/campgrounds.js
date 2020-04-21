var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
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
      username: req.user.username,
   };
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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgraoundOwnership, function (req, res) {
   Campground.findById(req.params.id, function (err, foundCampground) {
      res.render("campgrounds/edit", { campground: foundCampground });
   });
});

// UPDTAE CAMPGROUND ROUTE
router.put("/:id", checkCampgraoundOwnership, function (req, res) {
   // find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.edittedCampground, function (err, updtaedCampground) {
      if (err) {
         console.log(err);
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgraoundOwnership, function (req, res) {
   Campground.findByIdAndRemove(req.params.id, function (err, campgroundRemoved) {
      if (err) {
         res.redirect("/campgrounds/" + req.params.id);
      } else {
         Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, function (err) {
            if (err) {
               console.log(err);
            }
            res.redirect("/campgrounds");
         });
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

// Middleware for authorization
function checkCampgraoundOwnership(req, res, next) {
   // Is the user logged in? If yes...
   if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function (err, foundCampground) {
         if (err) {
            // "back" sends the user back to where they were before this page
            res.redirect("back");
         } else {
            // Does the user own this campground?
            // We need to check if the ID of the author matches the ID of the user
            if (foundCampground.author.id.equals(req.user._id)) {
               next();
            } else {
               // if the user does not own the campground
               res.redirect("back");
            }
         }
      });
   } else {
      // If not logged in, redirect
      res.redirect("back");
   }
}

module.exports = router;
