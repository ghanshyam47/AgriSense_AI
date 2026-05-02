import dotenv from "dotenv";
dotenv.config();

const required = []; // Make GEMINI_API_KEY optional at startup (features will warn if missing)
const optional = {
  PORT: "3000",
  NODE_ENV: "development",
  MONGODB_URI: "mongodb://localhost:27017/agrisense",
  REDIS_URL: "redis://default:nK3gVc55A5fF7Pehein9ORH0OCZiLPd3@redis-19360.c14.us-east-1-3.ec2.cloud.redislabs.com:19360",
  OPENWEATHER_API_KEY: "",
  CLERK_SECRET_KEY: "",
  CLERK_PUBLISHABLE_KEY: "",
  ML_SERVICE_URL: "http://localhost:5000",
  CORS_ORIGIN: "http://localhost:5173",
};

// Warn if Gemini API key missing — backend will run but AI features requiring Gemini will be disabled
if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "\n⚠️  GEMINI_API_KEY not set. Gemini AI features will be disabled.",
  );
  console.warn(
    "   To enable AI features, set GEMINI_API_KEY in your .env file or environment variables.\n",
  );
}

export const config = {
  PORT: process.env.PORT || optional.PORT,
  NODE_ENV: process.env.NODE_ENV || optional.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI || optional.MONGODB_URI,
  REDIS_URL: process.env.REDIS_URL || optional.REDIS_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENWEATHER_API_KEY:
    process.env.OPENWEATHER_API_KEY || optional.OPENWEATHER_API_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || optional.CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY:
    process.env.CLERK_PUBLISHABLE_KEY || optional.CLERK_PUBLISHABLE_KEY,
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || optional.ML_SERVICE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || optional.CORS_ORIGIN,
};
