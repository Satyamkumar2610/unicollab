const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { name, email, password, university, major } = req.body;

    if (!name || !email || !password || !university || !major) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, university, major });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret');
    
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, university: user.university, major: user.major }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret');
    
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, university: user.university, major: user.major }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;