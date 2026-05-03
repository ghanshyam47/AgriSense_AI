import { Ollama } from 'ollama';
import { config } from '../config/env.js';
import { mlService } from './ml.service.js';
import { weatherService } from './weather.service.js';
import { marketService } from './market.service.js';
import { voiceService } from './voice.service.js';
import { cacheService } from './cache.service.js';
import { logger } from '../utils/logger.js';

const ollama = new Ollama({ host: config.OLLAMA_HOST });
const model = config.OLLAMA_MODEL;

// ── Tool declarations for Ollama function calling ───
const tools = [
  {
    type: 'function',
    function: {
      name: 'getCropRecommendation',
      description: 'Get crop recommendation based on soil and weather conditions. Use when farmer asks what to plant or grow.',
      parameters: {
        type: 'object',
        properties: {
          soil_condition: { type: 'string', description: 'Soil: dry, wet, normal, sandy, clay, red, black' },
          season: { type: 'string', description: 'Season: kharif, rabi, zaid, monsoon' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getWeatherForecast',
      description: 'Get 5-day weather forecast for a location. Use when farmer asks about weather or needs weather data for planning.',
      parameters: {
        type: 'object',
        properties: {
          lat: { type: 'number', description: 'Latitude' },
          lng: { type: 'number', description: 'Longitude' },
        },
        required: ['lat', 'lng'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getIrrigationPlan',
      description: 'Get irrigation schedule for a crop. Use when farmer asks about watering or irrigation.',
      parameters: {
        type: 'object',
        properties: {
          crop: { type: 'string', description: 'Crop name' },
          soil_type: { type: 'string', description: 'Soil type: sandy, loamy, clay, silt, red, black' },
          temperature: { type: 'number', description: 'Current temperature in Celsius' },
          humidity: { type: 'number', description: 'Current humidity percentage' },
          rainfall_forecast: { type: 'number', description: 'Expected rainfall in next 5 days (mm)' },
          crop_stage: { type: 'string', description: 'Growth stage: initial, vegetative, flowering, maturity' },
        },
        required: ['crop', 'soil_type', 'temperature', 'humidity', 'rainfall_forecast'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getMarketPrices',
      description: 'Get current market prices for a crop. Use when farmer asks about selling price or market rates.',
      parameters: {
        type: 'object',
        properties: {
          crop: { type: 'string', description: 'Crop/commodity name' },
          state: { type: 'string', description: 'Indian state name (optional)' },
        },
        required: ['crop'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'compareMSP',
      description: 'Compare market price with MSP (Minimum Support Price). Use when farmer asks if they should sell or about government price.',
      parameters: {
        type: 'object',
        properties: {
          crop: { type: 'string', description: 'Crop name' },
          state: { type: 'string', description: 'State name (optional)' },
        },
        required: ['crop'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'detectPestFromDescription',
      description: 'Identify possible pest/disease from symptom description. Use when farmer describes crop problems without an image.',
      parameters: {
        type: 'object',
        properties: {
          symptoms: { type: 'string', description: 'Description of symptoms seen on the crop' },
          crop: { type: 'string', description: 'Affected crop name' },
        },
        required: ['symptoms', 'crop'],
      },
    },
  },
];

// ── System prompt for the Agentic AI ────────────────
const SYSTEM_PROMPT = `You are AgriSense AI — a friendly, expert agricultural advisor for Indian farmers.

IMPORTANT RULES:
1. Always respond in simple, easy-to-understand language. Avoid technical jargon.
2. When the farmer describes their situation in simple terms (like "my soil is dry"), use the tools to get data-driven recommendations.
3. Always use the available tools to back your advice with real data (weather, market prices, ML predictions).
4. Include practical, actionable advice that a farmer can immediately follow.
5. If the farmer speaks in Hindi or another Indian language, respond in the SAME language.
6. Always mention specific numbers when available (rainfall in mm, prices in ₹, temperature in °C).
7. Be encouraging and supportive — farming is hard work.
8. When recommending crops, always mention the MSP if available.
9. For irrigation advice, always consider the weather forecast.
10. Format your responses with clear sections using simple headings.

You have access to these tools:
- getCropRecommendation: Get ML-based crop suggestions
- getWeatherForecast: Get 5-day weather forecast
- getIrrigationPlan: Get irrigation schedule
- getMarketPrices: Get current mandi prices
- compareMSP: Compare with government MSP
- detectPestFromDescription: Identify diseases from symptoms

ALWAYS call a tool before giving advice. If you do not know the soil or season, assume "normal" and "kharif".
Keep your responses extremely short for voice calls (1-2 sentences).`;

// ── Tool execution functions ────────────────────────
const toolExecutors = {
  async getCropRecommendation(args) {
    try {
      // Small models sometimes send string "undefined" or garbage args, clean them up
      const clean = (val, fallback) => (val && val !== 'undefined') ? val : fallback;
      
      const payload = {
        soil_condition: clean(args.soil_condition, 'normal'),
        season: clean(args.season, 'kharif'),
        temperature: clean(args.temperature, undefined),
        humidity: clean(args.humidity, undefined),
        rainfall: clean(args.rainfall, undefined),
      };
      const result = await mlService.predictCrop(payload);
      return result;
    } catch (err) {
      logger.error(`Tool getCropRecommendation failed: ${err.message}`);
      return { error: err.message };
    }
  },

  async getWeatherForecast(args) {
    try {
      const lat = args.lat !== 'undefined' ? args.lat : undefined;
      const lng = args.lng !== 'undefined' ? args.lng : undefined;
      return await weatherService.getForecast(lat, lng);
    } catch (err) {
      return { error: err.message };
    }
  },

  async getIrrigationPlan(args) {
    try {
      const result = await mlService.planIrrigation({
        crop: args.crop,
        soil_type: args.soil_type,
        temperature: args.temperature,
        humidity: args.humidity,
        rainfall_forecast: args.rainfall_forecast,
        crop_stage: args.crop_stage,
      });
      return result;
    } catch (err) {
      return { error: err.message };
    }
  },

  async getMarketPrices(args) {
    try {
      return await marketService.getPrices(args.crop, args.state);
    } catch (err) {
      return { error: err.message };
    }
  },

  async compareMSP(args) {
    try {
      return await marketService.comparePriceToMSP(args.crop, args.state);
    } catch (err) {
      return { error: err.message };
    }
  },

  async detectPestFromDescription(args) {
    try {
      const result = await mlService.getCropInfo(args.crop);
      return {
        crop: args.crop,
        symptoms: args.symptoms,
        crop_info: result,
        note: 'For accurate pest detection, upload an image via POST /api/pest/detect',
      };
    } catch (err) {
      return { error: err.message };
    }
  },
};

/**
 * Process a chat message through the Ollama agentic pipeline.
 * 1. Send message + tool declarations to Ollama
 * 2. Execute any function calls Ollama requests
 * 3. Send results back to Ollama for final response
 * 4. Translate if needed
 */
export const processMessage = async (message, context = {}) => {
  const { language = 'en', location, crops = [], conversationHistory = [] } = context;

  // Build messages array
  const messages = [];
  messages.push({ role: 'system', content: SYSTEM_PROMPT });

  // Add recent history (last 6 messages for context)
  const recentHistory = conversationHistory.slice(-6);
  for (const msg of recentHistory) {
    messages.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content });
  }

  // Add current message with context
  let enrichedMessage = message;
  if (location) {
    enrichedMessage += `\n[User location: lat=${location.lat}, lng=${location.lng}, state=${location.state || 'unknown'}]`;
  }
  if (crops.length > 0) {
    enrichedMessage += `\n[User's current crops: ${crops.join(', ')}]`;
  }
  if (language !== 'en') {
    enrichedMessage += `\n[Respond in language code: ${language}]`;
  }

  messages.push({ role: 'user', content: enrichedMessage });

  try {
    // Step 1: Call Ollama with tools (if supported)
    let response;
    try {
      response = await ollama.chat({
        model,
        messages,
        tools,
      });
    } catch (err) {
      if (err.message.includes('does not support tools')) {
        logger.warn(`Model ${model} does not support tools. Retrying without tools.`);
        response = await ollama.chat({
          model,
          messages,
        });
      } else {
        throw err;
      }
    }

    // Step 2: Check if Ollama wants to call functions
    if (response.message.tool_calls && response.message.tool_calls.length > 0) {
      const toolResults = [];

      // Add the tool calls message to the history so the model knows what it called
      messages.push(response.message);

      for (const call of response.message.tool_calls) {
        logger.info(`🔧 Ollama calling tool: ${call.function.name}(${JSON.stringify(call.function.arguments)})`);
        const executor = toolExecutors[call.function.name];
        let result;
        if (executor) {
          result = await executor(call.function.arguments);
        } else {
          result = { error: `Unknown tool: ${call.function.name}` };
        }
        
        toolResults.push({
          functionCall: call.function,
          result,
        });

        // Step 3: Add tool results back to the conversation
        messages.push({
          role: 'tool',
          content: JSON.stringify(result),
        });
      }

      // Ask Ollama for the final response after tools
      const finalResponse = await ollama.chat({
        model,
        messages,
      });

      let responseText = finalResponse.message.content || 'I apologize, I could not generate a response.';

      // Step 4: Translate if needed
      if (language !== 'en') {
        responseText = await voiceService.translate(responseText, language);
      }

      return {
        response: responseText,
        toolsUsed: toolResults.map(tr => tr.functionCall.name),
        language,
      };
    }

    // No function calls — direct text response
    let responseText = response.message.content || 'I apologize, I could not generate a response.';

    if (language !== 'en') {
      responseText = await voiceService.translate(responseText, language);
    }

    return { response: responseText, toolsUsed: [], language };

  } catch (err) {
    logger.error(`Ollama processMessage error: ${err.message}`);
    throw new Error(`AI processing failed: ${err.message}`);
  }
};

export const addReasoning = async (feature, input, mlResult) => {
  const prompt = `You are an AI agricultural advisor. The ML model has provided a prediction for ${feature}.
Input details: ${JSON.stringify(input)}
ML Prediction: ${JSON.stringify(mlResult)}

Please provide a short, simple reasoning and practical advice based on this prediction. Keep it under 3 sentences.`;

  try {
    const response = await ollama.chat({
      model,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.message.content;
  } catch (err) {
    logger.error(`Ollama reasoning error: ${err.message}`);
    return "Explanation currently unavailable.";
  }
};

export const aiService = { processMessage, addReasoning };
