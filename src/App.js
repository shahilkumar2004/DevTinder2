const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const mongoose = require("mongoose");



const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("fetched sucessfully");
});

app.put("/feed", async (req, res) => {
  try {
    await res.send("connected successfuly");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    await res.send("login page created");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/profile", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

connectDb().then(() => {
  app.listen(4000, () => {
    console.log("server is running on port 4000");
  });

  console.log("connceted to database sucessfully");
});
