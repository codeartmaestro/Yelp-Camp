var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
/* we could've said var middleware = require ("../middleware/index.js").
But when we require the directory, the index.js file is automatically required. no need to mention it, but it's ok to do so. */
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

// NEW - show form to create a new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
   res.render("campgrounds/new");
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
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

// SHOW - show more info about the campground
router.get("/:id", function (req, res) {
   // Find the campground with that id
   Campground.findById(req.params.id)
      .populate("comments")
      .exec(function (err, foundCampground) {
         if (err || !foundCampground) {
            req.flash("error", "Campground Not Found!");
            res.redirect("/campgrounds");
         } else {
            // render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
         }
      });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgraoundOwnership, function (req, res) {
   Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
         req.flash("error", "Campground Not Found!");
         res.redirect("/campgrounds/" + req.params.id);
      }
      res.render("campgrounds/edit", { campground: foundCampground });
   });
});

// UPDTAE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgraoundOwnership, function (req, res) {
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
router.delete("/:id", middleware.checkCampgraoundOwnership, function (req, res) {
   Campground.findByIdAndRemove(req.params.id, function (err, campgroundRemoved) {
      if (err) {
         res.redirect("/campgrounds/" + req.params.id);
      } else {
         Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, function (err) {
            if (err) {
               console.log(err);
            }
            req.flash("success", "Campground Deleted!");
            res.redirect("/campgrounds");
         });
      }
   });
});

module.exports = router;
