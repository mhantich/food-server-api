const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validateRequest = require("../middleware/validateRequest");

// Middleware to validate token
exports.validateToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user, valid: true });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", valid: false });
  }
};

// Register route
exports.register = async (req, res) => {
  console.log(req.body);
  console.log('hello');
  try {


    const userData = {
      ...req.body,
      profileImage: req.file ? req.file.path : undefined,
    };

    const user = new User(userData);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login route
exports.login = async (req, res) => {
    console.log('hel');
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get profile route
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

