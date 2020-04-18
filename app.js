var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   Campground = require("./models/campground"),
   Comment = require("./models/comment"),
   seedDB = require("./seeds");

seedDB();
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
   res.render("landing");
});

app.get("/campgrounds", function (req, res) {
   // get all campgrounds from DB
   Campground.find({}, function (err, allCampgrounds) {
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds/index", { campgroundsGallery: allCampgrounds });
      }
   });
});

app.post("/campgrounds", function (req, res) {
   // get data from form and add to campgrounds array
   var newName = req.body.nameAdded;
   var newImage = req.body.imageAdded;
   var newDescription = req.body.descriptionAdded;
   var newCampground = { name: newName, image: newImage, description: newDescription };
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

app.get("/campgrounds/new", function (req, res) {
   res.render("campgrounds/new");
});

// SHOW - Show more info about the campground
app.get("/campgrounds/:id", function (req, res) {
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

// ========================
// COMMENTS ROUTES
// ========================
app.get("/campgrounds/:id/comments/new", function (req, res) {
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

app.post("/campgrounds/:id/comments", function (req, res) {
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

app.listen(3000, function () {
   console.log("The YelpCamp Server has started!");
});
