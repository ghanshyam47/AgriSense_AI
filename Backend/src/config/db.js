import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';


const connectDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(config.MONGODB_URI);
      logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      logger.error(`❌ MongoDB connection attempt ${i + 1} failed: ${error.message}`);
      if (i < retries - 1) {
        logger.info('   Retrying in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  logger.error('❌ MongoDB connection failed after all retries. Exiting.');
  process.exit(1);
};

export default connectDB;
