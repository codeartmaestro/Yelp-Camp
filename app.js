var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   flash = require("connect-flash"),
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
// console.log(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://leilaAdmin:LeIlA53452AdMiN234246@yelp-camp-tlk1z.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
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
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next(); //this line is very important, b/c it's a middleware and it need to proceed not stop
});

// USING EXPRESS ROUTER
/* If we use prefixes below such as "/campgrounds" it is going to add that to all the routes in the respective file, so we should remove it from the file itself */
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// port
var port = process.env.PORT || 3000;
app.listen(port, function () {
   console.log("The YelpCamp Server has started!");
});
