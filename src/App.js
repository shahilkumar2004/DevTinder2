const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const mongoose = require("mongoose");
const { isValidatingSignUp, isValidatinglogin } = require("./utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { useAuth } = require("./middleware/auth");
const cors = require("cors");

const app = express();
// midleware cors used as to work properly on different port for frontend and backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// this is the midleware to convert the data to readable json ->
// ->created in use to work for all the routes
app.use(express.json());
// we need another midleware t parse the cookes
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRoutes);
app.use("/", requestRoutes);
app.use("/", userRouter);

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

// app.post("/login", async (req, res) => {
//   try {
//     const email = req.body.email;
//     const findEmail = await User.find({ email: email });

//     res.send(findEmail);
//   } catch (err) {
//     res.status(400).send("ERROR: " + err.message);
//   }
// });

connectDb()
  .then(() => {
    console.log("Database is connected succesfully");
    app.listen(4000, () => {
      console.log("server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log("Datatbase is not connected ");
    console.log(err);
  });
