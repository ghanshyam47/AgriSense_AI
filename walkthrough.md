# Walkthrough — Node.js Backend → Spring Boot Migration

## Summary

Successfully converted the existing **Node.js / Express** backend into a **Spring Boot 3.3** application with:

- **Java 17** + **Maven**
- **PostgreSQL** (replacing MongoDB)
- **Redis** for caching
- **Pure JWT** authentication (replacing Clerk)
- **Spring WebSocket (STOMP)** (replacing Socket.IO)
- **@Scheduled** jobs (replacing node-cron)

**Build status:** ✅ `mvnw compile` passed with exit code 0.

---

## Project Structure

```
agrisense_server/
├── pom.xml
├── src/main/java/com/agrisense/server/
│   ├── AgrisenseServerApplication.java        # Entry point
│   ├── config/
│   │   ├── SecurityConfig.java                # JWT-based Spring Security
│   │   ├── CorsConfig.java                    # CORS (origin from yml)
│   │   ├── WebSocketConfig.java               # STOMP over SockJS
│   │   └── RestTemplateConfig.java            # RestTemplate bean
│   ├── security/
│   │   ├── JwtTokenProvider.java              # Generate / validate / parse JWT
│   │   └── JwtAuthenticationFilter.java       # OncePerRequestFilter
│   ├── model/
│   │   ├── User.java                          # JPA entity (users table)
│   │   ├── FarmProfile.java                   # JPA entity (farm_profiles)
│   │   ├── Alert.java                         # JPA entity (alerts)
│   │   └── ChatMessage.java                   # JPA entity (chat_messages)
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── FarmProfileRepository.java
│   │   └── AlertRepository.java
│   ├── dto/
│   │   ├── AuthDto.java                       # Register, Login, Profile, Farm DTOs
│   │   ├── ChatDto.java
│   │   ├── CropDto.java
│   │   ├── IrrigationDto.java
│   │   └── VoiceDto.java
│   ├── service/
│   │   ├── AuthService.java                   # Register, login, profile updates
│   │   ├── GeminiAiService.java               # Gemini chat + translate + advice
│   │   ├── MLServiceClient.java               # Proxy to Python Flask ML service
│   │   ├── WeatherService.java                # OpenWeatherMap integration
│   │   ├── MarketService.java                 # Prices, MSP, trends, AI advice
│   │   └── AlertService.java                  # CRUD + WebSocket push
│   ├── controller/
│   │   ├── HealthController.java              # GET /api/health
│   │   ├── AuthController.java                # POST register/login, GET/PATCH profile, PUT farm
│   │   ├── ChatController.java                # POST message, GET/DELETE history
│   │   ├── CropController.java                # POST recommend, GET info/{crop}
│   │   ├── IrrigationController.java          # POST plan, GET today
│   │   ├── PestController.java                # POST detect (multipart), GET common/{crop}
│   │   ├── MarketController.java              # GET prices/msp/trend/advice per crop
│   │   ├── WeatherController.java             # GET forecast/current/agri-alerts
│   │   ├── AlertController.java               # GET alerts, GET unread, PATCH read, DELETE
│   │   └── VoiceController.java               # POST translate, POST process
│   ├── exception/
│   │   └── GlobalExceptionHandler.java        # Consistent {error, code} JSON errors
│   └── job/
│       ├── WeatherAlertJob.java               # @Scheduled every 1 hour
│       └── MarketSyncJob.java                 # @Scheduled every 6 hours
└── src/main/resources/
    └── application.yml                        # All config (DB, Redis, JWT, APIs)
```

---

## API Endpoint Mapping (Node.js → Spring Boot)

| Node.js Route | Spring Boot Route | Controller |
|---|---|---|
| `GET /api/health` | `GET /api/health` | HealthController |
| `POST /api/auth/register` | `POST /api/auth/register` | AuthController |
| `POST /api/auth/login` | `POST /api/auth/login` | AuthController |
| `GET /api/auth/profile` 🔒 | `GET /api/auth/profile` 🔒 | AuthController |
| `PATCH /api/auth/profile` 🔒 | `PATCH /api/auth/profile` 🔒 | AuthController |
| `PUT /api/auth/farm` 🔒 | `PUT /api/auth/farm` 🔒 | AuthController |
| `POST /api/chat/message` | `POST /api/chat/message` | ChatController |
| `GET /api/chat/history` | `GET /api/chat/history` | ChatController |
| `DELETE /api/chat/history` | `DELETE /api/chat/history` | ChatController |
| `POST /api/crop/recommend` | `POST /api/crop/recommend` | CropController |
| `GET /api/crop/info/:cropName` | `GET /api/crop/info/{cropName}` | CropController |
| `POST /api/irrigation/plan` | `POST /api/irrigation/plan` | IrrigationController |
| `GET /api/irrigation/today` | `GET /api/irrigation/today` | IrrigationController |
| `POST /api/pest/detect` | `POST /api/pest/detect` | PestController |
| `GET /api/pest/common/:crop` | `GET /api/pest/common/{crop}` | PestController |
| `GET /api/market/prices/:crop` | `GET /api/market/prices/{crop}` | MarketController |
| `GET /api/market/msp/:crop` | `GET /api/market/msp/{crop}` | MarketController |
| `GET /api/market/trend/:crop` | `GET /api/market/trend/{crop}` | MarketController |
| `GET /api/market/advice/:crop` | `GET /api/market/advice/{crop}` | MarketController |
| `GET /api/weather/forecast` | `GET /api/weather/forecast` | WeatherController |
| `GET /api/weather/current` | `GET /api/weather/current` | WeatherController |
| `GET /api/weather/agri-alerts` | `GET /api/weather/agri-alerts` | WeatherController |
| `GET /api/alerts` 🔒 | `GET /api/alerts` 🔒 | AlertController |
| `GET /api/alerts/unread` 🔒 | `GET /api/alerts/unread` 🔒 | AlertController |
| `PATCH /api/alerts/:id/read` 🔒 | `PATCH /api/alerts/{id}/read` 🔒 | AlertController |
| `DELETE /api/alerts/:id` 🔒 | `DELETE /api/alerts/{id}` 🔒 | AlertController |
| `POST /api/voice/translate` | `POST /api/voice/translate` | VoiceController |
| `POST /api/voice/process` | `POST /api/voice/process` | VoiceController |

---

## Key Technology Replacements

| Node.js | Spring Boot |
|---|---|
| Express + `cors` middleware | Spring Web + `CorsConfig` |
| Mongoose + MongoDB | Spring Data JPA + PostgreSQL |
| `bcryptjs` | `BCryptPasswordEncoder` |
| `jsonwebtoken` + Clerk | `io.jsonwebtoken` (JJWT) with custom filter |
| Socket.IO | Spring WebSocket (STOMP over SockJS) |
| `node-cron` | `@Scheduled` annotations |
| `multer` (file upload) | Spring `MultipartFile` |
| `ioredis` | Spring Data Redis (`StringRedisTemplate`) |
| `axios` | `RestTemplate` |
| `winston` (logging) | SLF4J + Logback (Spring default) |

---

## How to Run

### Prerequisites
- **Java 17** installed
- **PostgreSQL** running on `localhost:5432` with a database called `agrisense`
- **Redis** running on `localhost:6379`
- **Python ML Service** running on `localhost:5000` (optional — for ML features)

### Steps

```bash
cd agrisense_server

# 1. Update application.yml with your real credentials:
#    - PostgreSQL username/password
#    - GEMINI_API_KEY environment variable
#    - OPENWEATHER_API_KEY environment variable

# 2. Build
.\mvnw.cmd clean package -DskipTests

# 3. Run
.\mvnw.cmd spring-boot:run

# Server starts on http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Quick Test
```bash
# Health check
curl http://localhost:8080/api/health

# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ravi","email":"ravi@example.com","password":"password123"}'

# Login (returns JWT token)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ravi@example.com","password":"password123"}'
```

---

## Verification

- ✅ `mvnw compile` — **passed** (exit code 0, no errors)
- ⏳ Runtime testing requires PostgreSQL + Redis to be running
