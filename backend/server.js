const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { setupSocketHandlers } = require('./utils/socketHandlers');
const { apiLimiter } = require('./middleware/rateLimiter');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'https://unicollab-psi.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }
});

app.set('io', io);

setupSocketHandlers(io);

const corsOptions = {
  origin: [
    'https://unicollab-psi.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(apiLimiter); // Apply rate limiting to all routes

console.log(' Connecting to MongoDB...');
console.log('URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log(' MongoDB Connected Successfully');
    console.log('Database:', process.env.MONGODB_URI);
  })
  .catch(err => {
    console.error(' MongoDB Connection Error:', err.message);
    process.exit(1);
  });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/project'));
app.use('/api/users', require('./routes/user'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/collaboration-requests', require('./routes/collaborationRequest'));
app.use('/api/teams', require('./routes/team'));
app.use('/api/workspaces', require('./routes/workspace'));
app.use('/api/recommendations', require('./routes/recommendations'));

app.get('/', (req, res) => res.json({ message: 'UniCollab API Running' }));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.url });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(` WebSocket server ready`);
});
