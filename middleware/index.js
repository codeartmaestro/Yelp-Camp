var Campground = require("../models/campground");
var Comment = require("../models/comment");

// All middlewares go here
var middlewareObj = {};

// Middleware for authorization
middlewareObj.checkCampgraoundOwnership = function (req, res, next) {
    // Is the user logged in? If yes...
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground Not Found!");
                // "back" sends the user back to where they were before this page
                res.redirect("back");
            } else {
                // Does the user own this campground?
                // We need to check if the ID of the author matches the ID of the user
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    // if the user does not own the campground
                    res.redirect("back");
                }
            }
        });
    } else {
        // If not logged in, redirect
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    // Is the user logged in? If yes...
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found!");
                // "back" sends the user back to where they were before this page
                res.redirect("back");
            } else {
                // Does the user own this campground?
                // We need to check if the ID of the author matches the ID of the user
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    // if the user does not own the campground
                    res.redirect("back");
                }
            }
        });
    } else {
        // If not logged in, redirect
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

// Middleware for authentication - check if the user is logged in
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;

