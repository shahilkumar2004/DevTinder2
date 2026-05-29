const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const mongoose = require("mongoose");
const isValidateSignData = require("./utils/validator");
const bcrypt = require("bcrypt");

const app = express();
// this is the midleware to convert the data to readable json ->
// ->created in use to work for all the routes
app.use(express.json());

// app.use("/", async (req, res) => {
//   res.send("fetched sucessfully");
// });

app.post("/signup", async (req, res) => {
  try {
    // validate the data
    isValidateSignData(req);
    // encrypt the password

    // creating a new instance of the user model
    const userObj = req.body;
    // created instance and saved to the database
    const user = await new User(userObj).save();

    console.log(user);

    res.send("signup successfuly");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// finding one user from the database using email
app.get("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const findEmail = await User.find({ email: email });
    if (findEmail.length === 0) {
      res.status(400).send("user not find");
    } else {
      res.send(findEmail);
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// feed api - set/ feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    // this will help you to find all the data from database
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// updating the by id
app.patch("/user", async (req, res) => {
  try {
    const id = req.body;
    const ALLOWED_UPDATES = [
      "imgURL",
      "gender",
      "age",
      "skills",
      "password",
      "about",
      "fisrtName",
      "lastName",
    ];
    const isUpdateAllowed = Object.keys(res.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    const upDate = await User.findByIdAndUpdate({ id: userid }, id);
    res.send(upDate);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const findEmail = await User.find({ email: email });

    res.send(findEmail);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.put("/profile", async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database is connected succesfully");
    app.listen(4000, () => {
      console.log("server is running on port 4000");
    });
  })
  .catch(() => {
    console.log("Datatbase is not connected ");
  });
