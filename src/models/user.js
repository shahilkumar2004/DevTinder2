const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    index: true,
    maxlength: 30,
    minlength: 3,
    trim: true,
  },

  lastName: {
    type: String,
    maxlength: 30,
    minlength: 3,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("password is not strong");
      }
    },
  },

  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },

  age: {
    type: Number,
    min: 18,
    max: 100,
  },

  imgURL: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid image URL");
      }
    },
  },
  about: {
    type: String,
    maxlength: 500,
  },

  skills: {
    type: [String],
  },
});
// User is created as user in the database cloud
const User = mongoose.model("User", userSchema);

module.exports = User;
