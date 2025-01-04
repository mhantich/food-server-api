const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all users (protected route)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload profile image
router.post('/upload-profile', auth, upload.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const user = await User.findById(req.user.id);
    user.profileImage = req.file.path;
    await user.save();

    res.json({ message: 'Profile image uploaded', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;