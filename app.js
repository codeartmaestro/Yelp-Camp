var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   passport = require("passport"),
   localStrategy = require("passport-local"),
   methodOverride = require("method-override"),
   Campground = require("./models/campground"),
   Comment = require("./models/comment"),
   User = require("./models/user"),
   seedDB = require("./seeds");

// requiring routes
var commentRoutes = require("./routes/comments"),
   campgroundRoutes = require("./routes/campgrounds"),
   indexRoutes = require("./routes/index");

mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(
   require("express-session")({
      secret: "This is a secret message",
      resave: false,
      saveUninitialized: false,
   })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// To define currentUser on all the routes, we can define a MIDDLEWARE
app.use(function (req, res, next) {
   res.locals.currentUser = req.user;
   next(); //this line is very important, b/c it's a middleware and it need to proceed not stop
});

// USING EXPRESS ROUTER
/* If we use prefixes below such as "/campgrounds" it is going to add that to all the routes in the respective file, so we should remove it from the file itself */
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// port
app.listen(3000, function () {
   console.log("The YelpCamp Server has started!");
});
