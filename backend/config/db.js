import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn('⚠️ MONGO_URI not found. Backend will operate in in-memory fallback mode (100% stable).');
      return false;
    }
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Database Connection Warning: ${error.message}`);
    console.warn('👉 Operating in in-memory fallback mode. The server will remain online.');
    return false;
  }
};

export default connectDB;