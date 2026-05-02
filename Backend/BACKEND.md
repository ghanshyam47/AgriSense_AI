# 🌾 AgriSense Backend — API Documentation

> Node.js + Express REST API powering the AgriSense AI agricultural platform.  
> Base URL: `http://localhost:3000/api`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Configuration & Setup](#configuration--setup)
3. [Running the Servers](#running-the-servers)
4. [Authentication](#authentication)
5. [Rate Limiting](#rate-limiting)
6. [API Endpoints](#api-endpoints)
   - [Health Check](#health-check)
   - [Auth / Profile](#auth--profile)
   - [Chat (AI Agent)](#chat-ai-agent)
   - [Crop Recommendation](#crop-recommendation)
   - [Irrigation Planning](#irrigation-planning)
   - [Pest Detection](#pest-detection)
   - [Market Intelligence](#market-intelligence)
   - [Weather](#weather)
   - [Smart Alerts](#smart-alerts)
   - [Voice & Translation](#voice--translation)
7. [ML Service Endpoints (Python)](#ml-service-endpoints-python)
8. [Real-Time Events (Socket.IO)](#real-time-events-socketio)
9. [Background Jobs](#background-jobs)
10. [Error Responses](#error-responses)

---

## Architecture Overview

```
AgriSense_AI/
├── Backend/               # Node.js / Express API (port 3000)
│   ├── server.js          # Entry point — HTTP server + Socket.IO
│   └── src/
│       ├── app.js         # Express app, middleware, route mounting
│       ├── config/        # env.js, db.js
│       ├── controllers/   # Business logic per domain
│       ├── routes/        # Route definitions
│       ├── middleware/     # auth, rateLimiter, upload, errorHandler
│       ├── models/        # Mongoose schemas
│       ├── services/      # ml.service, external API wrappers
│       ├── jobs/          # node-cron scheduled jobs
│       └── utils/         # logger, helpers
│
└── MLservice/             # Python / Flask ML API (port 5000)
    ├── app.py             # Flask entry point
    ├── services/          # crop_service, pest_service, irrigation_service
    └── training/          # Model training scripts
```

The Node backend proxies ML inference requests to the Flask service and enriches results with AI commentary via **Google Gemini**.

---

## Configuration & Setup

### 1. Backend (Node.js)

Copy the example env file and fill in your values:

```bash
cd Backend
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `NODE_ENV` | `development` | `development` \| `production` |
| `MONGODB_URI` | `mongodb://localhost:27017/agrisense` | MongoDB connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string (session / cache) |
| `GEMINI_API_KEY` | *(required)* | Google Gemini API key for AI features |
| `OPENWEATHER_API_KEY` | *(required)* | OpenWeatherMap API key |
| `JWT_SECRET` | *(required)* | Secret key for signing JWTs — **change in production** |
| `JWT_EXPIRES_IN` | `7d` | JWT token lifetime |
| `ML_SERVICE_URL` | `http://localhost:5000` | Base URL of the Flask ML service |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin (Vite frontend) |

**Example `.env`:**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agrisense
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=AIza...your_key_here
OPENWEATHER_API_KEY=abc123...your_key_here
JWT_SECRET=super_long_random_secret_string_change_me
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:5173
```

### 2. ML Service (Python)

```bash
cd MLservice
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Dependencies installed:**
- `flask 3.1.1` + `flask-cors 5.0.1`
- `scikit-learn 1.6.1`, `numpy`, `pandas`, `joblib`
- `pillow 11.2.1` (image processing)
- `tensorflow 2.19.0` (pest detection model)
- `gunicorn 23.0.0` (production server)

---

## Running the Servers

### Development

```bash
# Terminal 1 — Node backend (auto-restarts on file changes)
cd Backend
npm install
npm run dev

# Terminal 2 — Python ML service
cd MLservice
python app.py
```

### Production

```bash
# Node backend
cd Backend
npm start

# Python ML service (with gunicorn)
cd MLservice
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Available npm scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `node --watch server.js` | Development with hot reload |
| `start` | `node server.js` | Production start |
| `test` | `jest` (experimental VM modules) | Run test suite |

---

## Authentication

The backend uses **Clerk** + **JWT** dual-mode authentication.

- Routes marked 🔒 require a valid JWT in the `Authorization` header.
- Routes marked 🔓 support optional auth (enhanced features when authenticated).
- Routes with no lock icon are fully public.

**Request header format:**
```
Authorization: Bearer <jwt_token>
```

---

## Rate Limiting

Two rate limit tiers are applied globally:

| Limiter | Applied To | Limit |
|---|---|---|
| `generalLimiter` | All `/api/*` routes | Standard request limit |
| `authLimiter` | Auth endpoints | Stricter limit (brute-force protection) |
| `mlLimiter` | ML inference endpoints | Prevents abuse of expensive AI calls |

---

## API Endpoints

### Health Check

#### `GET /api/health`
Returns server status, uptime, and timestamp. No authentication required.

**Response `200`:**
```json
{
  "status": "ok",
  "service": "AgriSense Backend",
  "timestamp": "2026-05-02T08:00:00.000Z",
  "uptime": 3600.42
}
```

---

### Auth / Profile

Base path: `/api/auth`

> All auth routes require authentication 🔒

#### `GET /api/auth/profile` 🔒
Fetch the authenticated user's profile.

**Response `200`:**
```json
{
  "id": "user_abc123",
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "farmProfile": { ... }
}
```

---

#### `PATCH /api/auth/profile` 🔒
Update user profile fields.

**Request body:**
```json
{
  "name": "Ravi Kumar",
  "phone": "+91-9876543210"
}
```

**Response `200`:** Updated user object.

---

#### `PUT /api/auth/farm` 🔒
Update the user's farm profile (location, size, soil type, etc.).

**Request body:**
```json
{
  "farmName": "Green Valley Farm",
  "location": "Punjab, India",
  "areaHectares": 5.5,
  "soilType": "loamy",
  "primaryCrops": ["wheat", "rice"]
}
```

**Response `200`:** Updated farm profile object.

---

### Chat (AI Agent)

Base path: `/api/chat`

> Uses **Google Gemini** for AI responses. ML rate limiter applied.

#### `POST /api/chat/message` 🔓
Send a message to the AgriSense AI farming assistant.

**Request body:**
```json
{
  "message": "When should I irrigate my wheat crop?",
  "language": "en"
}
```

**Response `200`:**
```json
{
  "reply": "For wheat at the tillering stage...",
  "sessionId": "sess_xyz"
}
```

---

#### `GET /api/chat/history` 🔓
Retrieve the current session's chat history.

**Response `200`:**
```json
{
  "messages": [
    { "role": "user", "content": "...", "timestamp": "..." },
    { "role": "assistant", "content": "...", "timestamp": "..." }
  ]
}
```

---

#### `DELETE /api/chat/history` 🔓
Clear the current session's chat history.

**Response `200`:**
```json
{ "success": true, "message": "Chat history cleared" }
```

---

### Crop Recommendation

Base path: `/api/crop`

#### `POST /api/crop/recommend`
Get AI-powered crop recommendations. Accepts two input modes.

**Mode A — Simple (farmer-friendly):**
```json
{
  "soil_condition": "normal",
  "season": "kharif",
  "temperature": 28,
  "humidity": 75,
  "rainfall": 200
}
```

| Field | Values |
|---|---|
| `soil_condition` | `"dry"` \| `"wet"` \| `"normal"` |
| `season` | `"kharif"` \| `"rabi"` \| `"zaid"` |

**Mode B — Technical:**
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.8,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9
}
```

**Response `200`:**
```json
{
  "success": true,
  "recommendations": [
    { "crop": "rice", "confidence": 0.94, "notes": "..." },
    { "crop": "maize", "confidence": 0.78, "notes": "..." },
    { "crop": "cotton", "confidence": 0.61, "notes": "..." }
  ]
}
```

---

#### `GET /api/crop/info/:cropName`
Get detailed agronomic information for a specific crop.

**Path param:** `cropName` — e.g., `wheat`, `rice`, `cotton`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "name": "wheat",
    "season": "rabi",
    "waterRequirement": "medium",
    "soilType": ["loamy", "clay-loam"],
    "growthDays": 120,
    "commonPests": ["aphids", "rust"]
  }
}
```

---

### Irrigation Planning

Base path: `/api/irrigation`

#### `POST /api/irrigation/plan`
Generate a 5-day irrigation schedule.

**Request body:**
```json
{
  "crop": "wheat",
  "soil_type": "loamy",
  "temperature": 24,
  "humidity": 60,
  "rainfall_forecast": [0, 5, 0, 0, 2],
  "wind_speed": 12,
  "crop_stage": "tillering"
}
```

| Field | Required | Description |
|---|---|---|
| `crop` | ✅ | Crop name |
| `soil_type` | ✅ | `"sandy"` \| `"loamy"` \| `"clay"` \| `"silt"` |
| `temperature` | ✅ | Average temperature (°C) |
| `humidity` | ✅ | Relative humidity (%) |
| `rainfall_forecast` | ✅ | Array of 5 daily rainfall values (mm) |
| `wind_speed` | ❌ | Wind speed (km/h) |
| `crop_stage` | ❌ | Growth stage (e.g., `"germination"`, `"tillering"`, `"flowering"`) |

**Response `200`:**
```json
{
  "success": true,
  "plan": {
    "summary": "Moderate irrigation needed for days 1, 3, and 4.",
    "dailyPlan": [
      { "day": 1, "irrigate": true, "amount_mm": 25, "reason": "Low humidity, no rain" },
      { "day": 2, "irrigate": false, "amount_mm": 0, "reason": "5mm rainfall expected" }
    ]
  }
}
```

---

#### `GET /api/irrigation/today`
Get today's irrigation recommendation based on current weather.

**Response `200`:** Same shape as the daily plan entry for today.

---

### Pest Detection

Base path: `/api/pest`

#### `POST /api/pest/detect`
Detect plant disease or pest from a crop image.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Constraint |
|---|---|---|---|
| `image` | File | ✅ | `.jpg`, `.jpeg`, `.png`, `.webp`, `.bmp` — max **10 MB** |

**Response `200`:**
```json
{
  "success": true,
  "detection": {
    "disease": "Leaf Rust",
    "confidence": 0.91,
    "severity": "moderate",
    "treatment": "Apply propiconazole fungicide at 0.1% concentration...",
    "preventionTips": ["Avoid overhead irrigation", "Ensure proper spacing"]
  }
}
```

---

#### `GET /api/pest/common/:crop`
List common pests and diseases for a given crop.

**Path param:** `crop` — e.g., `wheat`, `tomato`, `rice`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "name": "Aphids", "type": "pest", "season": "rabi", "severity": "high" },
    { "name": "Leaf Rust", "type": "disease", "season": "rabi", "severity": "moderate" }
  ]
}
```

---

### Market Intelligence

Base path: `/api/market`

#### `GET /api/market/prices/:crop`
Get current market prices for a crop across mandis.

**Path param:** `crop` — e.g., `wheat`, `rice`, `onion`

**Response `200`:**
```json
{
  "crop": "wheat",
  "prices": [
    { "mandi": "Ludhiana", "price": 2200, "unit": "₹/quintal", "date": "2026-05-02" },
    { "mandi": "Amritsar", "price": 2180, "unit": "₹/quintal", "date": "2026-05-02" }
  ]
}
```

---

#### `GET /api/market/msp/:crop`
Get the government Minimum Support Price (MSP) for a crop.

**Response `200`:**
```json
{
  "crop": "wheat",
  "msp": 2275,
  "unit": "₹/quintal",
  "season": "rabi 2025-26"
}
```

---

#### `GET /api/market/trend/:crop`
Get 30-day price trend data for charting.

**Response `200`:**
```json
{
  "crop": "wheat",
  "trend": [
    { "date": "2026-04-01", "price": 2150 },
    { "date": "2026-04-02", "price": 2160 }
  ]
}
```

---

#### `GET /api/market/advice/:crop`
Get AI-generated sell/hold/buy advice for a crop.

**Response `200`:**
```json
{
  "crop": "wheat",
  "advice": "hold",
  "reasoning": "Prices are expected to rise by 5-8% in the next 2 weeks due to export demand...",
  "confidence": "medium"
}
```

---

### Weather

Base path: `/api/weather`

> Uses **OpenWeatherMap** API. Query params: `lat`, `lon` or `city`.

#### `GET /api/weather/forecast`
Get a 5-day weather forecast.

**Query params:**
| Param | Example | Description |
|---|---|---|
| `lat` | `30.9` | Latitude |
| `lon` | `75.85` | Longitude |
| `city` | `Ludhiana` | City name (alternative to lat/lon) |

**Response `200`:**
```json
{
  "city": "Ludhiana",
  "forecast": [
    { "date": "2026-05-02", "temp": 32, "humidity": 60, "rain": 0, "description": "Sunny" }
  ]
}
```

---

#### `GET /api/weather/current`
Get current weather conditions.

**Query params:** same as `/forecast`

**Response `200`:** Single weather object for current conditions.

---

#### `GET /api/weather/agri-alerts`
Get weather-based agricultural alerts (frost risk, heat stress, flood warning, etc.).

**Query params:** same as `/forecast`

**Response `200`:**
```json
{
  "alerts": [
    { "type": "heat_stress", "severity": "high", "message": "Temperatures above 38°C expected — irrigate early morning." }
  ]
}
```

---

### Smart Alerts

Base path: `/api/alerts`

> All alert routes require authentication 🔒

#### `GET /api/alerts` 🔒
Get all alerts for the authenticated user.

**Query params:**
| Param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `limit` | `20` | Items per page |
| `unread` | `false` | Filter to unread only |

**Response `200`:**
```json
{
  "alerts": [
    {
      "_id": "alert_123",
      "type": "weather",
      "title": "Rain Expected",
      "message": "Heavy rainfall of 45mm expected tomorrow. Postpone irrigation.",
      "read": false,
      "createdAt": "2026-05-02T06:00:00Z"
    }
  ],
  "total": 12,
  "page": 1
}
```

---

#### `GET /api/alerts/unread` 🔒
Get the count of unread alerts.

**Response `200`:**
```json
{ "count": 3 }
```

---

#### `PATCH /api/alerts/:id/read` 🔒
Mark a specific alert as read.

**Path param:** `id` — Alert document ID

**Response `200`:**
```json
{ "success": true }
```

---

#### `DELETE /api/alerts/:id` 🔒
Delete a specific alert.

**Path param:** `id` — Alert document ID

**Response `200`:**
```json
{ "success": true }
```

---

### Voice & Translation

Base path: `/api/voice`

#### `POST /api/voice/translate`
Translate text between languages (supports regional Indian languages).

**Request body:**
```json
{
  "text": "आज गेहूं की सिंचाई कब करें?",
  "from": "hi",
  "to": "en"
}
```

**Response `200`:**
```json
{
  "translatedText": "When should we irrigate wheat today?",
  "from": "hi",
  "to": "en"
}
```

---

#### `POST /api/voice/process` 🔓
Process a voice query — transcribes audio and routes to the AI agent.

**Content-Type:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `audio` | File | Audio file (WAV / MP3 / OGG) |
| `language` | String | Language code, e.g., `"hi"`, `"pa"`, `"en"` |

**Response `200`:**
```json
{
  "transcript": "आज गेहूं की सिंचाई कब करें?",
  "reply": "गेहूं की टिलरिंग स्टेज में...",
  "replyAudio": "<base64_audio_or_url>"
}
```

---

## ML Service Endpoints (Python)

Base URL: `http://localhost:5000`

> These endpoints are called internally by the Node backend. You can also call them directly for testing.

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check — returns model load status |
| `POST` | `/predict/crop` | Crop recommendation (same input as Node proxy) |
| `GET` | `/crop/info/<crop_name>` | Crop information |
| `POST` | `/predict/pest` | Pest/disease detection from image upload |
| `GET` | `/pest/common/<crop>` | Common pests for a crop |
| `POST` | `/predict/irrigation` | 5-day irrigation plan |

**ML Health Check Response:**
```json
{
  "status": "ok",
  "service": "AgriSense ML Service",
  "models": {
    "crop": true,
    "pest": true,
    "irrigation": true
  }
}
```

---

## Real-Time Events (Socket.IO)

The backend exposes a Socket.IO server at `ws://localhost:3000`.

### Client → Server Events

| Event | Payload | Description |
|---|---|---|
| `join` | `userId: string` | Join user-specific alert room to receive personal notifications |

### Server → Client Events

| Event | Payload | Triggered By |
|---|---|---|
| `alert:new` | Alert object | Weather alert job or ML anomaly detection |
| `market:update` | Price update object | Market sync cron job |

**Example client setup:**
```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
socket.emit('join', userId);

socket.on('alert:new', (alert) => {
  console.log('New alert:', alert);
});
```

---

## Background Jobs

Two cron jobs run automatically on server start:

| Job | Schedule | Description |
|---|---|---|
| `weatherAlert.job` | Every hour | Fetches weather data and generates agricultural alerts for all users |
| `marketSync.job` | Every 6 hours | Syncs market price data from external sources and caches in Redis |

---

## Error Responses

All errors follow a consistent shape:

```json
{
  "error": "Human-readable error message",
  "code": "OPTIONAL_ERROR_CODE"
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — missing or invalid JWT |
| `403` | Forbidden — insufficient permissions |
| `404` | Not found — route or resource doesn't exist |
| `429` | Too many requests — rate limit exceeded |
| `500` | Internal server error |

---

*Generated for AgriSense AI — Backend v1.0.0*
