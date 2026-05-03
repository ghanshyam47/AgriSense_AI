import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import cropRoutes from "./routes/crop.routes.js";
import irrigationRoutes from "./routes/irrigation.routes.js";
import pestRoutes from "./routes/pest.routes.js";
import marketRoutes from "./routes/market.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { logger } from "./utils/logger.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.js";

const app = express();

// Trust proxy for express-rate-limit (required for ngrok)
app.set('trust proxy', 1);

// ── Global Middleware ────────────────────────────────
const corsOrigin = config.NODE_ENV === 'production'
  ? config.CORS_ORIGIN
  : (origin, callback) => {
      // Allow any localhost port in development (Vite picks 5173/5174/5175 etc.)
      if (!origin || /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev for convenience
      }
    };
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Disable browser caching for API responses ───────
// This prevents 304 Not Modified on dynamic endpoints (chat, alerts, etc.)
// Server-side Redis caching still works — this only affects browser HTTP cache.
app.set("etag", false);
app.use("/api/", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});
app.use("/api/", generalLimiter);

// ── Request Logger ───────────────────────────────────
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// ── Health Check ─────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "AgriSense Backend",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── API Routes ───────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/irrigation", irrigationRoutes);
app.use("/api/pest", pestRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/chat", chatRoutes);

// ── Swagger UI ─────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ── 404 Handler ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ─────────────────────────────
app.use(errorHandler);

export default app;
