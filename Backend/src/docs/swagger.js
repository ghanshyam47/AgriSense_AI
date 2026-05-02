const swaggerDocument = {
  openapi: "3.0.1",
  info: {
    title: "AgriSense Backend API",
    version: "1.0.0",
    description: "API docs for the AgriSense backend. Base URL uses /api.",
  },
  servers: [
    { url: "http://localhost:3000/api", description: "Local development" },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: { 200: { description: "OK" } },
      },
    },

    "/auth/profile": {
      get: {
        summary: "Get current user profile",
        responses: { 200: { description: "User profile" } },
      },
      patch: {
        summary: "Update profile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProfileUpdate" },
            },
          },
        },
        responses: { 200: { description: "Updated profile" } },
      },
    },

    "/auth/farm": {
      put: {
        summary: "Update farm profile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FarmProfile" },
            },
          },
        },
        responses: { 200: { description: "Updated farm profile" } },
      },
    },

    "/crop/recommend": {
      post: {
        summary: "Crop recommendation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  { $ref: "#/components/schemas/CropTechnical" },
                  { $ref: "#/components/schemas/CropSimple" },
                ],
              },
            },
          },
        },
        responses: { 200: { description: "Recommendations" } },
      },
    },

    "/crop/info/{cropName}": {
      get: {
        summary: "Crop info",
        parameters: [
          {
            name: "cropName",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Crop info" } },
      },
    },

    "/irrigation/plan": {
      post: {
        summary: "Irrigation plan",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/IrrigationRequest" },
            },
          },
        },
        responses: { 200: { description: "Irrigation plan" } },
      },
    },

    "/irrigation/today": {
      get: {
        summary: "Irrigation for today",
        parameters: [
          {
            name: "lat",
            in: "query",
            required: true,
            schema: { type: "number" },
          },
          {
            name: "lng",
            in: "query",
            required: true,
            schema: { type: "number" },
          },
          {
            name: "crop",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "soil_type",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Today irrigation recommendation" } },
      },
    },

    "/pest/detect": {
      post: {
        summary: "Pest detection from image",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: { image: { type: "string", format: "binary" } },
              },
            },
          },
        },
        responses: { 200: { description: "Detection result" } },
      },
    },

    "/pest/common/{crop}": {
      get: {
        summary: "Common pests for a crop",
        parameters: [
          {
            name: "crop",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Common pests" } },
      },
    },

    "/market/prices/{crop}": {
      get: {
        summary: "Market prices",
        parameters: [
          {
            name: "crop",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "state",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Market prices" } },
      },
    },

    "/market/msp/{crop}": {
      get: {
        summary: "Minimum support price",
        parameters: [
          {
            name: "crop",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "MSP" } },
      },
    },

    "/market/trend/{crop}": {
      get: {
        summary: "Price trend",
        parameters: [
          {
            name: "crop",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "state",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "days",
            in: "query",
            required: false,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Trend" } },
      },
    },

    "/market/advice/{crop}": {
      get: {
        summary: "Market advice vs MSP",
        parameters: [
          {
            name: "crop",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "state",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Advice" } },
      },
    },

    "/weather/forecast": {
      get: {
        summary: "5-day weather forecast",
        parameters: [
          {
            name: "lat",
            in: "query",
            required: true,
            schema: { type: "number" },
          },
          {
            name: "lng",
            in: "query",
            required: true,
            schema: { type: "number" },
          },
        ],
        responses: { 200: { description: "Forecast" } },
      },
    },

    "/weather/current": {
      get: {
        summary: "Current weather",
        parameters: [
          {
            name: "lat",
            in: "query",
            required: true,
            schema: { type: "number" },
          },
          {
            name: "lng",
            in: "query",
            required: true,
            schema: { type: "number" },
          },
        ],
        responses: { 200: { description: "Current weather" } },
      },
    },

    "/weather/agri-alerts": {
      get: {
        summary: "Agricultural alerts",
        parameters: [
          {
            name: "lat",
            in: "query",
            required: true,
            schema: { type: "number" },
          },
          {
            name: "lng",
            in: "query",
            required: true,
            schema: { type: "number" },
          },
        ],
        responses: { 200: { description: "Alerts" } },
      },
    },

    "/alerts": {
      get: {
        summary: "List alerts",
        parameters: [
          {
            name: "type",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Alerts list" } },
      },
    },

    "/alerts/unread": {
      get: {
        summary: "Unread alert count",
        responses: { 200: { description: "Unread count" } },
      },
    },

    "/alerts/{id}/read": {
      patch: {
        summary: "Mark alert as read",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Marked as read" } },
      },
    },

    "/alerts/{id}": {
      delete: {
        summary: "Delete alert",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Deleted" } },
      },
    },

    "/voice/translate": {
      post: {
        summary: "Translate text",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TranslateRequest" },
            },
          },
        },
        responses: { 200: { description: "Translated text" } },
      },
    },

    "/voice/process": {
      post: {
        summary: "Process transcribed voice text",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProcessVoice" },
            },
          },
        },
        responses: { 200: { description: "Processed voice text" } },
      },
    },

    "/chat/message": {
      post: {
        summary: "Send chat message",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChatMessage" },
            },
          },
        },
        responses: { 200: { description: "Assistant response" } },
      },
    },

    "/chat/history": {
      get: {
        summary: "Get chat history",
        responses: { 200: { description: "History" } },
      },
      delete: {
        summary: "Clear chat history",
        responses: { 200: { description: "Cleared" } },
      },
    },
  },
  components: {
    schemas: {
      CropTechnical: {
        type: "object",
        properties: {
          N: { type: "number" },
          P: { type: "number" },
          K: { type: "number" },
          temperature: { type: "number" },
          humidity: { type: "number" },
          ph: { type: "number" },
          rainfall: { type: "number" },
        },
        required: ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"],
      },
      CropSimple: {
        type: "object",
        properties: {
          soil_condition: { type: "string" },
          season: { type: "string" },
          temperature: { type: "number" },
          humidity: { type: "number" },
          rainfall: { type: "number" },
        },
        required: ["soil_condition", "season"],
      },
      IrrigationRequest: {
        type: "object",
        properties: {
          crop: { type: "string" },
          soil_type: { type: "string" },
          temperature: { type: "number" },
          humidity: { type: "number" },
          rainfall_forecast: { type: "number" },
          wind_speed: { type: "number" },
          crop_stage: { type: "string" },
        },
        required: [
          "crop",
          "soil_type",
          "temperature",
          "humidity",
          "rainfall_forecast",
        ],
      },
      ProfileUpdate: {
        type: "object",
        properties: {
          name: { type: "string" },
          language: { type: "string" },
          location: { type: "object" },
        },
      },
      FarmProfile: {
        type: "object",
        properties: {
          farmSize: { type: "number" },
          soilType: { type: "string" },
          currentCrops: { type: "array", items: { type: "string" } },
          waterSource: { type: "string" },
          irrigationType: { type: "string" },
          cropStage: { type: "string" },
        },
      },
      TranslateRequest: {
        type: "object",
        properties: {
          text: { type: "string" },
          targetLang: { type: "string" },
        },
        required: ["text", "targetLang"],
      },
      ProcessVoice: {
        type: "object",
        properties: {
          text: { type: "string" },
          language: { type: "string" },
        },
        required: ["text"],
      },
      ChatMessage: {
        type: "object",
        properties: {
          message: { type: "string" },
          language: { type: "string" },
        },
        required: ["message"],
      },
    },
  },
};

export default swaggerDocument;
