const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;