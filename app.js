var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

var campgroundsArr = [
   {
      name: "Salmon Creek",
      image: "http://source.unsplash.com/800x400/?creek"
   },
   {
      name: "Granite Hill",
      image: "http://source.unsplash.com/800x400/?hill"
   },
   {
      name: "Mountain Goat's Rest",
      image: "http://source.unsplash.com/800x400/?mountain"
   },
   {
      name: "Himalayas",
      image: "http://source.unsplash.com/800x400/?himalaya"
   },
   {
      name: "Washington, D.C.",
      image: "http://source.unsplash.com/800x400/?washington"
   },
   {
      name: "New York City",
      image: "http://source.unsplash.com/800x400/?new+york"
   }
];

app.get("/", function (req, res) {
   res.render("landing");
});

app.get("/campgrounds", function (req, res) {
   res.render("campgrounds", { campgroundsGallery: campgroundsArr });
});

app.post("/campgrounds", function (req, res) {
   // get data from form and add to campgrounds array
   var newName = req.body.nameAdded;
   var newImage = req.body.imageAdded;
   var newCampground = { name: newName, image: newImage }
   campgroundsArr.push(newCampground);
   // redirect to campgrounds page
   res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
   res.render("new");
});

app.listen(3000, function () {
   console.log("The YelpCamp Server has started!");
});
