const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate usernames
    trim: true // Removes leading/trailing spaces
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique emails
    trim: true,
    lowercase: true // Stores emails in lowercase
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", UserSchema);
