const express = require("express");
const { useAuth } = require("../middleware/auth");
const { validateProfileEdit } = require("../utils/validator");
const profileRoutes = express.Router();

profileRoutes.get("/profile/view", useAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send(user);
  } catch (err) {
    return res.status(400).send("ERROR : " + err.message);
  }
});

profileRoutes.patch("/profile/edit", useAuth, async (req, res) => {
  try {
    const profileEditAllowed = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skills",
      "imgURL",
    ];

    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      profileEditAllowed.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Invalid fields for update");
    }

    validateProfileEdit(req.body);

    Object.keys(req.body).forEach((key) => {
      req.user[key] = req.body[key];
    });

    await req.user.save();

    res.send({
      message: "Profile updated successfully",
      data: req.user,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});



profileRoutes.patch("/profile/password", useAuth, async (req, res) => {});
module.exports = profileRoutes;
