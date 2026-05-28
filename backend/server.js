import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Feedback from './models/Feedback.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// @desc    Health check/Index route
// @route   GET /
app.get('/', (req, res) => {
  res.json({ message: 'Feedback System API is running smoothly.' });
});

// @desc    Submit user feedback
// @route   POST /api/feedback
app.post('/api/feedback', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database connection is offline. Please make sure MongoDB is running locally, or configure a valid MONGO_URI in backend/.env to connect to MongoDB Atlas.',
      });
    }

    const { name, email, category, rating, message } = req.body;

    // Simple manual validation
    if (!name || !email || !category || !rating || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill all required fields.',
      });
    }

    // Save to database
    const feedback = new Feedback({
      name,
      email,
      category,
      rating,
      message,
    });

    const savedFeedback = await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully.',
      data: savedFeedback,
    });
  } catch (error) {
    console.error(`Feedback submission error: ${error.message}`);
    
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error. Please try again later.',
    });
  }
});

// @desc    Retrieve all feedbacks (highly useful for developers/admins to verify)
// @route   GET /api/feedback
app.get('/api/feedback', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database connection is offline. Please verify that your MongoDB connection string in backend/.env is valid.',
      });
    }

    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error(`Retrieve feedback error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server Error. Could not fetch feedbacks.',
    });
  }
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Define server PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});
