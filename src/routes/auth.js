const express = require("express");
const { isValidatingSignUp, isValidatinglogin } = require("../utils/validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { useAuth } = require("../middleware/auth");
const authRoutes = express.Router();

authRoutes.post("/signup", async (req, res) => {
  try {
    // validate the data
    isValidatingSignUp(req);
    // encrypt the password

    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      age,
      imgURL,
      skills,
      about,
    } = req.body;

    const encyptedpassward = await bcrypt.hash(password, 10);

    //creating a new instance of the user model

    // created instance and saved to the database

    const user = await new User({
      firstName,
      lastName,
      email,
      password: encyptedpassward,
      gender,
      age,
      imgURL,
      skills,
      about,
    }).save();

    // FIX: Changed res.send(User) to res.send(user).
    // User (capital U) is the Mongoose model class itself, not the saved document.
    // Sending the model class returns garbage data to the client.
    // user (lowercase) is the actual document created by .save() above.
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRoutes.post("/login", async (req, res) => {
  try {
    // validated the data
    isValidatinglogin(req);
    // extracted from the body
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email id is not present");
    }

    const isValidPassword = await bcrypt.compare(password, user?.password);

    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    } else {
      // creating the token
      const token = await jwt.sign({ _id: user._id }, "devTinder1234");
      // add th token cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send(user);
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRoutes.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout Successfuly");
});

authRoutes.get("/feed", useAuth, async (req, res) => {
  try {
    // this will help you to find all the data from database
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = authRoutes;
