var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function (req, res) {
   res.render("landing");
});

app.get("/campgrounds", function (req, res) {
   var campgrounds = [
      {
         name: "Salmon Creek",
         image: "http://source.unsplash.com/800x400/?creek",
      },
      {
         name: "Granite Hill",
         image: "http://source.unsplash.com/800x400/?hill",
      },
      {
         name: "Mountain Goat's Rest",
         image: "http://source.unsplash.com/800x400/?mountain",
      }
   ]

    res.render("campgrounds", {campgroundsVar: campgrounds});
});

app.listen(3000, function () {
   console.log("The YelpCamp Server has started!");
});
