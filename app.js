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
   image: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//    {
//       name: "Tehran",
//       image: "http://source.unsplash.com/800x400/?tehran"
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
         res.render("campgrounds", { campgroundsGallery: allCampgrounds });
      }
   })

});

app.post("/campgrounds", function (req, res) {
   // get data from form and add to campgrounds array
   var newName = req.body.nameAdded;
   var newImage = req.body.imageAdded;
   var newCampground = { name: newName, image: newImage }
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

app.listen(3000, function () {
   console.log("The YelpCamp Server has started!");
});
