import axios from 'axios';
import { config } from '../config/env.js';
import { cacheService } from './cache.service.js';
import { logger } from '../utils/logger.js';

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

/** Get 5-day/3-hour weather forecast */
export const getForecast = async (lat, lng) => {
  const cacheKey = `weather:forecast:${lat}:${lng}`;
  return cacheService.getOrSet(cacheKey, async () => {
    if (!config.OPENWEATHER_API_KEY) {
      return getMockForecast(lat, lng);
    }
    try {
      const { data } = await axios.get(`${OWM_BASE}/forecast`, {
        params: { lat, lon: lng, appid: config.OPENWEATHER_API_KEY, units: 'metric' },
        timeout: 10000,
      });
      return parseForecast(data);
    } catch (err) {
      logger.error(`Weather API error: ${err.message}`);
      return getMockForecast(lat, lng);
    }
  }, cacheService.TTL.WEATHER);
};

/** Get current weather */
export const getCurrentWeather = async (lat, lng) => {
  const cacheKey = `weather:current:${lat}:${lng}`;
  return cacheService.getOrSet(cacheKey, async () => {
    if (!config.OPENWEATHER_API_KEY) {
      return getMockCurrent(lat, lng);
    }
    try {
      const { data } = await axios.get(`${OWM_BASE}/weather`, {
        params: { lat, lon: lng, appid: config.OPENWEATHER_API_KEY, units: 'metric' },
        timeout: 10000,
      });
      return {
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind_speed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        clouds: data.clouds.all,
        rain_1h: data.rain?.['1h'] || 0,
      };
    } catch (err) {
      logger.error(`Weather API error: ${err.message}`);
      return getMockCurrent(lat, lng);
    }
  }, cacheService.TTL.WEATHER);
};

/** Derive agricultural alerts from weather forecast */
export const getAgriculturalAlerts = async (lat, lng) => {
  const forecast = await getForecast(lat, lng);
  const alerts = [];

  if (!forecast?.daily) return alerts;

  for (const day of forecast.daily) {
    // Heavy rain warning
    if (day.rainfall > 50) {
      alerts.push({
        type: 'weather', severity: 'high',
        title: 'Heavy Rainfall Warning',
        message: `Heavy rain expected (${day.rainfall}mm) on ${day.date}. Delay irrigation and ensure drainage.`,
        actionable: 'Skip irrigation. Check field drainage. Protect harvested produce.',
        date: day.date,
      });
    }

    // Frost warning
    if (day.temp_min < 4) {
      alerts.push({
        type: 'weather', severity: 'critical',
        title: 'Frost Warning',
        message: `Temperature may drop to ${day.temp_min}°C on ${day.date}. Frost-sensitive crops at risk.`,
        actionable: 'Cover crops with mulch or plastic sheets. Irrigate in the evening.',
        date: day.date,
      });
    }

    // Heatwave
    if (day.temp_max > 42) {
      alerts.push({
        type: 'weather', severity: 'high',
        title: 'Heatwave Alert',
        message: `Temperature may reach ${day.temp_max}°C on ${day.date}. Increase irrigation.`,
        actionable: 'Water crops in early morning and evening. Apply mulch to retain moisture.',
        date: day.date,
      });
    }

    // Fungal disease risk
    if (day.humidity > 80 && day.temp_max > 25 && day.temp_max < 35) {
      alerts.push({
        type: 'pest', severity: 'medium',
        title: 'Fungal Disease Risk',
        message: `High humidity (${day.humidity}%) with warm temperatures on ${day.date}. Fungal infection risk is elevated.`,
        actionable: 'Inspect crops for early signs. Consider preventive fungicide spray.',
        date: day.date,
      });
    }
  }

  return alerts;
};

// ── Parse OpenWeatherMap response ───────────────────
function parseForecast(data) {
  const dailyMap = {};
  for (const item of data.list) {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = { temps: [], humidity: [], rainfall: 0, wind: [], descriptions: [] };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].humidity.push(item.main.humidity);
    dailyMap[date].rainfall += (item.rain?.['3h'] || 0);
    dailyMap[date].wind.push(item.wind.speed);
    dailyMap[date].descriptions.push(item.weather[0].description);
  }

  const daily = Object.entries(dailyMap).map(([date, d]) => ({
    date,
    temp_min: Math.round(Math.min(...d.temps) * 10) / 10,
    temp_max: Math.round(Math.max(...d.temps) * 10) / 10,
    temp_avg: Math.round((d.temps.reduce((a, b) => a + b, 0) / d.temps.length) * 10) / 10,
    humidity: Math.round(d.humidity.reduce((a, b) => a + b, 0) / d.humidity.length),
    rainfall: Math.round(d.rainfall * 10) / 10,
    wind_avg: Math.round((d.wind.reduce((a, b) => a + b, 0) / d.wind.length) * 10) / 10,
    description: d.descriptions[Math.floor(d.descriptions.length / 2)],
  }));

  return { city: data.city?.name || 'Unknown', daily };
}

// ── Mock data fallbacks ─────────────────────────────
function getMockForecast(lat, lng) {
  const today = new Date();
  const daily = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const baseTemp = 25 + Math.sin(lat * 0.1) * 10;
    return {
      date: date.toISOString().split('T')[0],
      temp_min: Math.round((baseTemp - 5 + Math.random() * 3) * 10) / 10,
      temp_max: Math.round((baseTemp + 5 + Math.random() * 3) * 10) / 10,
      temp_avg: Math.round(baseTemp * 10) / 10,
      humidity: Math.round(60 + Math.random() * 25),
      rainfall: Math.round(Math.random() * 30 * 10) / 10,
      wind_avg: Math.round((3 + Math.random() * 5) * 10) / 10,
      description: ['clear sky', 'few clouds', 'scattered clouds', 'light rain', 'moderate rain'][Math.floor(Math.random() * 5)],
    };
  });
  return { city: 'Mock Location', daily, mock: true };
}

function getMockCurrent(lat, lng) {
  const baseTemp = 25 + Math.sin(lat * 0.1) * 10;
  return {
    temperature: Math.round(baseTemp * 10) / 10,
    feels_like: Math.round((baseTemp + 2) * 10) / 10,
    humidity: Math.round(60 + Math.random() * 25),
    pressure: 1013,
    wind_speed: Math.round((3 + Math.random() * 5) * 10) / 10,
    description: 'partly cloudy',
    clouds: 40,
    rain_1h: 0,
    mock: true,
  };
}

export const weatherService = { getForecast, getCurrentWeather, getAgriculturalAlerts };
