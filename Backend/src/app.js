import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';


// Route imports
import authRoutes from './routes/auth.routes.js';
import cropRoutes from './routes/crop.routes.js';
import irrigationRoutes from './routes/irrigation.routes.js';
import pestRoutes from './routes/pest.routes.js';
import marketRoutes from './routes/market.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import alertRoutes from './routes/alert.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { logger } from './utils/logger.js';

const app = express();

// ── Global Middleware ────────────────────────────────
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', generalLimiter);


// ── Request Logger ───────────────────────────────────
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// ── Health Check ─────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AgriSense Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── API Routes ───────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/pest', pestRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/chat', chatRoutes);

// ── 404 Handler ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────
app.use(errorHandler);

export default app;
