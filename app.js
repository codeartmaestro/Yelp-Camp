var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   Campground = require("./models/campground"),
   seedDB = require("./seeds");

seedDB();
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
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
         res.render("index", { campgroundsGallery: allCampgrounds });
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
   res.render("new");
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
            res.render("show", { campground: foundCampground });
         }
      });
});

app.listen(3000, function () {
   console.log("The YelpCamp Server has started!");
});
