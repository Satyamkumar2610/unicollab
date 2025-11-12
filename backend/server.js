const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'http://localhost:3000', 'https://unicollab-nine.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
console.log('Auth routes registered at /api/auth');

app.get('/', (req, res) => {
  res.json({ 
    message: 'Unicollab API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API endpoint working' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));