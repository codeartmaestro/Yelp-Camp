var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("Comment", commentSchema);

/* 
To make comments visible, not just have an id, we need to
populate comments in the show route in app.js
*/