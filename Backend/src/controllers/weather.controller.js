import { weatherService } from '../services/weather.service.js';

export const getForecast = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng query params required' });
    const result = await weatherService.getForecast(parseFloat(lat), parseFloat(lng));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng query params required' });
    const result = await weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lng));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getAgriAlerts = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng query params required' });
    const result = await weatherService.getAgriculturalAlerts(parseFloat(lat), parseFloat(lng));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};
