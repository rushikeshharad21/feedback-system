import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import Feedback from './models/Feedback.js';

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Feedback System API is running smoothly.' });
});

app.post('/api/feedback', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, error: 'Database connection is offline.' });
    }

    const { name, email, category, rating, message } = req.body;

    if (!name || !email || !category || !rating || !message) {
      return res.status(400).json({ success: false, error: 'Please fill all required fields.' });
    }

    const feedback = new Feedback({ name, email, category, rating, message });
    const savedFeedback = await feedback.save();

    // Emit to all connected clients
    io.emit('newFeedback', savedFeedback);

    res.status(201).json({ success: true, message: 'Feedback submitted successfully.', data: savedFeedback });
  } catch (error) {
    console.error(`Feedback submission error: ${error.message}`);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: 'Server Error. Please try again later.' });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, error: 'Database connection is offline.' });
    }
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    console.error(`Retrieve feedback error: ${error.message}`);
    res.status(500).json({ success: false, error: 'Server Error. Could not fetch feedbacks.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});