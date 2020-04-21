
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
   username: String,
   password: String,
});
// This part is based on the link below to show a message for login failure
// https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/3861710#questions/2179932
var options = {
   errorMessages: {
      IncorrectPasswordError: 'Password is not valid!',
      IncorrectUsernameError: 'Username is not valid!'
   }
};

userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User", userSchema);
