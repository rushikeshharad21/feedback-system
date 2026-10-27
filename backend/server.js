import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Feedback from './models/Feedback.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

global.io = io;

/* ── IN-MEMORY FALLBACK DATA STORE (Prevents crash when Mongo is not configured) ── */
const saltRounds = 10;
const defaultAdminHash = bcrypt.hashSync('Rushi4441@#', saltRounds);
const defaultUserHash = bcrypt.hashSync('user123', saltRounds);

const mockUsers = [
  {
    _id: 'user-admin-1',
    name: 'Rushi Admin',
    email: 'rushikeshharad21@gmail.com',
    password: defaultAdminHash,
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user-standard-1',
    name: 'Rushi User',
    email: 'user@test.com',
    password: defaultUserHash,
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

const mockFeedbacks = [
  {
    _id: 'fb-1',
    name: 'Rushi Harad',
    email: 'rushikeshharad21@gmail.com',
    category: 'feature',
    rating: 5,
    message: 'The feedback analytics stream works in real-time!',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'fb-2',
    name: 'Anita Verma',
    email: 'anita@enterprise.com',
    category: 'praise',
    rating: 5,
    message: 'Love the fluid dark mode and responsive charts.',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: 'fb-3',
    name: 'Dev Tester',
    email: 'qa@company.org',
    category: 'bug',
    rating: 4,
    message: 'Minor padding overflow on ultra-wide screens.',
    createdAt: new Date(Date.now() - 14400000).toISOString()
  }
];

const getFeedbacksList = async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      return await Feedback.find().sort({ createdAt: -1 });
    } catch (err) {
      console.warn('MongoDB query failed, falling back to memory store:', err.message);
    }
  }
  return mockFeedbacks;
};

const broadcastFeedbacks = async () => {
  try {
    const allFeedbacks = await getFeedbacksList();
    io.emit('feedback-updated', allFeedbacks);
  } catch (err) {
    console.error('Error broadcasting feedbacks:', err.message);
  }
};

/* ── HEALTHCHECK ── */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'memory-fallback',
    timestamp: new Date().toISOString()
  });
});

/* ── AUTH ROUTES ── */

app.post('/api/user/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const userExists = await User.findOne({ email });
        if (userExists) {
          return res.status(400).json({ success: false, message: 'User already exists with this email address' });
        }
        const user = await User.create({ name, email, password, role });
        return res.status(201).json({
          success: true,
          message: 'Registration successful',
          user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
      } catch (dbErr) {
        console.warn('MongoDB register error, using memory fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const exists = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date().toISOString()
    };
    mockUsers.unshift(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email });
        if (user) {
          const isMatch = await user.matchPassword(password);
          if (isMatch) {
            return res.status(200).json({
              success: true,
              message: 'Login successful',
              user: { _id: user._id, name: user.name, email: user.email, role: user.role }
            });
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB login error, checking fallback store:', dbErr.message);
      }
    }

    // In-memory fallback lookup
    const mockUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!mockUser) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, mockUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { _id: mockUser._id, name: mockUser.name, email: mockUser.email, role: mockUser.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        return res.status(200).json(users);
      } catch (dbErr) {
        console.warn('MongoDB user list error, using fallback:', dbErr.message);
      }
    }
    const sanitized = mockUsers.map(({ password, ...u }) => u);
    res.status(200).json(sanitized);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ── FEEDBACK ROUTES ── */

app.post('/api/feedbacks', async (req, res) => {
  try {
    const { name, email, category, rating, message } = req.body;
    let feedback;

    if (mongoose.connection.readyState === 1) {
      try {
        feedback = await Feedback.create({ name, email, category, rating, message });
      } catch (dbErr) {
        console.warn('MongoDB feedback save error, using fallback:', dbErr.message);
      }
    }

    if (!feedback) {
      feedback = {
        _id: `fb-${Date.now()}`,
        name: name || 'Anonymous User',
        email: email || 'anonymous@dev.io',
        category: (category || 'general').toLowerCase(),
        rating: Number(rating) || 5,
        message: message || '',
        createdAt: new Date().toISOString()
      };
      mockFeedbacks.unshift(feedback);
    }

    // Emit live notification to admin room
    const notifPacket = {
      id: feedback._id.toString(),
      name: feedback.name,
      email: feedback.email,
      category: feedback.category,
      rating: feedback.rating,
      message: feedback.message,
      timestamp: Date.now()
    };
    io.to('admins').emit('admin-notification', notifPacket);

    // Broadcast updated collection to all sessions
    await broadcastFeedbacks();

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await getFeedbacksList();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ── SERVE STATIC FRONTEND (PRODUCTION SINGLE-SERVICE HOSTING) ── */
app.use(express.static(distPath));

// React Router SPA fallback for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

/* ── SOCKET.IO REAL-TIME LIFECYCLE ── */

io.on('connection', async (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on('join-room', (role) => {
    if (role === 'admin') {
      socket.join('admins');
      console.log(`🛡️ Admin joined room: ${socket.id}`);
    }
  });

  try {
    const initialFeedbacks = await getFeedbacksList();
    socket.emit('feedback-updated', initialFeedbacks);
  } catch (err) {
    console.error('Socket init error:', err.message);
  }

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Unified Server running on port ${PORT}`);
});