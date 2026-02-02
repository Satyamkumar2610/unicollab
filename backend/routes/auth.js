const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate, schemas } = require('../middleware/validator');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';

router.post('/register', authLimiter, validate(schemas.register), async (req, res) => {
  try {
    console.log('🔵 Register request:', req.body.email);
    const { name, email, password, university, major } = req.body;

    if (!name || !email || !password || !university || !major) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, university, major });
    console.log('✅ User created:', user._id);

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' });
    console.log('✅ Token generated');

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', authLimiter, validate(schemas.login), async (req, res) => {
  try {
    console.log('🔵 Login request:', req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Password valid for:', email);

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' });
    console.log('✅ Token generated');

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      major: user.major,
      bio: user.bio,
      skills: user.skills
    });
  } catch (error) {
    console.error('❌ Get user error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
