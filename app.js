var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   passport = require("passport"),
   localStrategy = require("passport-local"),
   Campground = require("./models/campground"),
   Comment = require("./models/comment"),
   User = require("./models/user"),
   seedDB = require("./seeds");

mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
seedDB();

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
})

// ===================
// ROUTES
// ===================
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
         //req.user is for showing the user's id on navbar
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
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

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
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

// ===================
// AUTH ROUTES
// ===================
// show register form
app.get("/register", function (req, res) {
   res.render("register");
});

// handle sign up logic
app.post("/register", function (req, res) {
   var newUser = new User({ username: req.body.username });
   User.register(newUser, req.body.password, function (err, user) {
      if (err) {
         console.log(err);
         return res.render("register");
      }
      passport.authenticate("local")(req, res, function () {
         res.redirect("/campgrounds");
      });
   });
});

// show login form
app.get("/login", function (req, res) {
   res.render("login");
});

// handle login logic
// app.post("/login", middleware, callback)
app.post(
   "/login",
   passport.authenticate("local", { successRedirect: "/campgrounds", failureRedirect: "/login" }),
   function (req, res) {}
);

// logout
app.get("/logout", function (req, res) {
   req.logout();
   res.redirect("/campgrounds");
});

// middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect("/login");
}

// port
app.listen(3000, function () {
   console.log("The YelpCamp Server has started!");
});
