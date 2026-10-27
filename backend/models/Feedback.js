import mongoose from 'mongoose';
import express from 'express';

// ==========================================
// 1. MONGOOSE SCHEMA & MODEL DEFINITION
// ==========================================

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email track identity is required'],
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'bug', 'feature', 'praise'],
    default: 'general',
    lowercase: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating score is required'],
    min: 1,
    max: 5
  },
  message: {
    type: String,
    required: [true, 'Operational narrative message is required'],
    trim: true
  }
}, { timestamps: true });

/**
 * ⚡ Real-Time Mongoose Post-Save Middleware Hook
 * Triggers automatically after a document is successfully saved to MongoDB.
 * Pushes the live notification straight to your SettingsView via your active Socket.io link.
 */
feedbackSchema.post('save', function (doc) {
  try {
    const notificationPacket = {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      category: doc.category,
      rating: doc.rating,
      message: doc.message,
      timestamp: doc.createdAt ? new Date(doc.createdAt).getTime() : Date.now()
    };

    // Broadcast through the global socket.io server instance attached to your server entry point
    if (global.io) {
      global.io.emit('admin-notification', notificationPacket);
    }
  } catch (error) {
    console.error('Failed to emit real-time event packet over WebSockets:', error);
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// ==========================================
// 2. EXPRESS ROUTER CONFIGURATION
// ==========================================

const router = express.Router();

/**
 * @route   POST /api/feedback
 * @desc    Receives a user submission, saves it to MongoDB, and triggers the live admin broadcast
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, category, rating, message } = req.body;

    // Create a new document instance following your Schema design
    const newFeedback = new Feedback({
      name,
      email,
      category,
      rating,
      message
    });

    // Save to MongoDB (triggers post-save WebSocket event above)
    const savedFeedback = await newFeedback.save();

    // Fetch the updated database collection to update all active analytics/dashboard sessions
    const allFeedbacks = await Feedback.find().sort({ createdAt: -1 });

    // Update the core charts and metrics tables across the platform
    if (global.io) {
      global.io.emit('feedback-updated', allFeedbacks);
    }

    return res.status(201).json({ 
      success: true, 
      message: 'Feedback submitted successfully', 
      data: savedFeedback 
    });

  } catch (error) {
    console.error('Error handling feedback submission route:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, errors: messages });
    }

    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   GET /api/feedback
 * @desc    Fetches initial collection history to hydrate the Zustand store on page refresh
 */
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching baseline feedback logs:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Export the Schema model as default, and the API routes as a named export
export { router as feedbackRoutes };
export default Feedback;