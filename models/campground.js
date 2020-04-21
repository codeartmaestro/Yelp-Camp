var mongoose = require("mongoose");

// CAMPGROUNDS SCHEMA
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String,
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment",
      },
   ],
});

// CAMPGROUND MODEL
module.exports = mongoose.model("Campground", campgroundSchema);

/* 
>> We could have kept the following line and do as follows:
var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
>> However, the way we did it above, "var Campground" is used in <app.js>:
var Campground = require("./models/campground")
*/
