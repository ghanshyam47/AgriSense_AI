import { mlService } from '../services/ml.service.js';
import { weatherService } from '../services/weather.service.js';
import { geminiService } from '../services/gemini.service.js';

export const plan = async (req, res, next) => {
  try {
    const mlResult = await mlService.planIrrigation(req.body);
    const reasoning = await geminiService.addReasoning('irrigation plan', req.body, mlResult);
    res.json({ success: true, data: { prediction: mlResult, reasoning } });
  } catch (err) { next(err); }
};

export const getToday = async (req, res, next) => {
  try {
    const { lat, lng, crop, soil_type } = req.query;
    if (!lat || !lng || !crop) {
      return res.status(400).json({ error: 'lat, lng, and crop are required' });
    }

    // Get current weather for irrigation context
    const weather = await weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lng));
    const forecast = await weatherService.getForecast(parseFloat(lat), parseFloat(lng));
    
    const totalRain = forecast.daily?.slice(0, 5).reduce((sum, d) => sum + d.rainfall, 0) || 0;

    const mlResult = await mlService.planIrrigation({
      crop,
      soil_type: soil_type || 'loamy',
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainfall_forecast: totalRain,
    });
    
    const reasoning = await geminiService.addReasoning('irrigation plan for today', { crop, soil_type, totalRain }, mlResult);

    res.json({ success: true, data: { prediction: mlResult, reasoning }, weather });
  } catch (err) { next(err); }
};
