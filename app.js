var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose")

mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// CAMPGROUNDS SCHEMA
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//    {
//       name: "Tehran",
//       image: "http://source.unsplash.com/800x400/?tehran",
//       description: "Tehran is the capital of Iran - an ancient country formerly known as Persia"
//    }, function (err, campground) {
//       if (err) {
//          console.log(err);
//       } else {
//          console.log("THE NEWLY CREATED CAMPGROUND IS:")
//          console.log(campground);
//       }
//    }
// )

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
   })

});

app.post("/campgrounds", function (req, res) {
   // get data from form and add to campgrounds array
   var newName = req.body.nameAdded;
   var newImage = req.body.imageAdded;
   var newDescription = req.body.descriptionAdded;
   var newCampground = { name: newName, image: newImage, description: newDescription }
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

// Show more info about the campground
app.get("/campgrounds/:id", function (req, res) {
   // Find the campground with that id
   Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
         console.log(err);
      } else {
         // render show template with that campground
         res.render("show", { campground: foundCampground});
      }
   })
});

app.listen(3000, function () {
   console.log("The YelpCamp Server has started!");
});
