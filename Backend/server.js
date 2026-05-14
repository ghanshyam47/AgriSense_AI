import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { config } from './src/config/env.js';
import { logger } from './src/utils/logger.js';
import { startWeatherAlertJob } from './src/jobs/weatherAlert.job.js';
import { startMarketSyncJob } from './src/jobs/marketSync.job.js';
import { mlService } from './src/services/ml.service.js';

const server = createServer(app);

// ── Socket.IO for real-time alerts ──────────────────

const io = new SocketIO(server, {
  cors: { origin: config.CORS_ORIGIN, methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {
  logger.info(`🔌 Socket connected: ${socket.id}`);

  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
    logger.debug(`Socket ${socket.id} joined room user:${userId}`);
  });

  socket.on('disconnect', () => {
    logger.debug(`Socket ${socket.id} disconnected`);
  });
});

// Make io accessible to services for alert pushing
app.set('io', io);

// ── Start Server ────────────────────────────────────
const start = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Check ML service health
    const mlHealth = await mlService.checkHealth();
    if (mlHealth.status === 'ok') {
      logger.info('✅ ML Service is healthy');
    } else {
      logger.warn(`⚠️  ML Service: ${mlHealth.error || 'unavailable'} — some features may not work`);
    }

    // 3. Start cron jobs
    startWeatherAlertJob();
    startMarketSyncJob();

    // 4. Start HTTP server
    server.listen(config.PORT, () => {
      logger.info(`\n🌾 ═══════════════════════════════════════════`);
      logger.info(`   AgriSense Backend running on port ${config.PORT}`);
      logger.info(`   Environment: ${config.NODE_ENV}`);
      logger.info(`   API: http://localhost:${config.PORT}/api`);
      logger.info(`   Health: http://localhost:${config.PORT}/api/health`);
      logger.info(`═══════════════════════════════════════════════\n`);
      logger.info('📡 API Endpoints:');
      logger.info('   POST /api/auth/register     — Register farmer');
      logger.info('   POST /api/auth/login         — Login');
      logger.info('   POST /api/chat/message        — Chat with AI agent');
      logger.info('   POST /api/crop/recommend      — Crop recommendation');
      logger.info('   POST /api/irrigation/plan     — Irrigation schedule');
      logger.info('   POST /api/pest/detect         — Pest detection (image)');
      logger.info('   GET  /api/market/prices/:crop — Market prices');
      logger.info('   GET  /api/weather/forecast    — Weather forecast');
      logger.info('   GET  /api/alerts              — Smart alerts');
      logger.info('   POST /api/voice/translate     — Translation');
      logger.info('');
    });
  } catch (error) {
    logger.error(`❌ Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

// ── Graceful Shutdown ───────────────────────────────
const shutdown = async (signal) => {
  logger.info(`\n${signal} received — shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled rejection: ${err.message}`);
});

start();
