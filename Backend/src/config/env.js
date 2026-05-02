import dotenv from 'dotenv';
dotenv.config();

const required = ['GEMINI_API_KEY'];
const optional = {
  PORT: '3000',
  NODE_ENV: 'development',
  MONGODB_URI: 'mongodb://localhost:27017/agrisense',
  REDIS_URL: '',
  OPENWEATHER_API_KEY: '',
  CLERK_SECRET_KEY: '',
  CLERK_PUBLISHABLE_KEY: '',
  ML_SERVICE_URL: 'http://localhost:5000',
  CORS_ORIGIN: 'http://localhost:5173',
};

// Validate required vars
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`\n❌ Missing required environment variables:\n   ${missing.join(', ')}\n`);
  console.error('   Copy .env.example to .env and fill in the values.\n');
  process.exit(1);
}

export const config = {
  PORT: process.env.PORT || optional.PORT,
  NODE_ENV: process.env.NODE_ENV || optional.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI || optional.MONGODB_URI,
  REDIS_URL: process.env.REDIS_URL || optional.REDIS_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || optional.OPENWEATHER_API_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || optional.CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || optional.CLERK_PUBLISHABLE_KEY,
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || optional.ML_SERVICE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || optional.CORS_ORIGIN,
};
