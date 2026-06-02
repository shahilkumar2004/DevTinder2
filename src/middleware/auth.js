const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose = require("mongoose");

const useAuth = async (req, res, next) => {
  try {
    // read the token from the req cookies
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      return res.status(401).send("login yourself");
    }
    // validate the token
    const decodedmessage = await jwt.verify(token, "devTinder1234");

    // find the user
    const { _id } = decodedmessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }

    // this will call he next function
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = {
  useAuth,
};
