var express = require("express");
/* without mergeParams add comment won't work b/c we refactored the routes and added route prefixes to app.js and we don't have /campgrounds/:id/comments in the routes here */
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
/* we could've said var middleware = require ("../middleware/index.js").
But when we require the directory, the index.js file is automatically required. no need to mention it, but it's ok to do so. */
// ===========================================================

// Comments New
router.get("/new", middleware.isLoggedIn, function (req, res) {
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
router.post("/", middleware.isLoggedIn, function (req, res) {
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

// EDIT COMMENT
// /campgrounds/:id/comments/:comment_id/edit --- nested routing.
// If we have both :id above, params takes the first one only
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
   Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
         res.redirect("back");
      } else {
         Campground.findById(req.params.id, function (err, foundCampground) {
            res.render("comments/edit", { campground: foundCampground, comment: foundComment });
         });
      }
   });
});
/*
**************** COLT'S SOUTION for EDIT ****************
in edit.js > instead of campground._id > campground_id > and remove campground.name
here in else part > instead of all Campground.findById... >
res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
I didn't do this because this way we cannot use any other parameter of campground such as name in our edit file.
*/

// UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
      if (err) {
         res.redirect("back");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function (err) {
      if (err) {
         res.redirect("back");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

module.exports = router;
