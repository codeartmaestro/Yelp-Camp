var express = require("express");
/* without mergeParams add comment won't work b/c we refactored the routes and added route prefixes to app.js and we don't have /campgrounds/:id/comments in the routes here */
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
// ===========================================================

// Comments New
router.get("/new", isLoggedIn, function (req, res) {
   // get the id of the campground
   Campground.findById(req.params.id, function (err, campground) {
      if (err) {
         console.log(err);
      } else {
         // send the comment
         res.render("comments/new", { campground: campground });
      }
   });
});

// Comments Creat
router.post("/", isLoggedIn, function (req, res) {
   // look up campground using ID
   Campground.findById(req.params.id, function (err, campground) {
      if (err) {
         console.log(err);
         res.redirect("/campgrounds");
      } else {
         // create a new comment
         Comment.create(req.body.comment, function (err, comment) {
            if (err) {
               console.log(err);
            } else {
               // add username and ID to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               // save comment
               comment.save();
               // associate or connect the new comment to campground
               campground.comments.push(comment);
               campground.save();
               // redirect to campground show page
               res.redirect("/campgrounds/" + campground._id);
            }
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

module.exports = router;
