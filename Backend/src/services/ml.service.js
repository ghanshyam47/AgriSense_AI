import axios from 'axios';
import { config } from '../config/env.js';
import FormData from 'form-data';
import { logger } from '../utils/logger.js';

const mlClient = axios.create({
  baseURL: config.ML_SERVICE_URL,
  timeout: 30000,
});

/** Check if ML service is healthy */
export const checkHealth = async () => {
  try {
    const { data } = await mlClient.get('/health');
    return data;
  } catch (err) {
    logger.warn(`ML Service health check failed: ${err.message}`);
    return { status: 'unavailable', error: err.message };
  }
};

/** Crop recommendation via ML model */
export const predictCrop = async (params) => {
  try {
    const { data } = await mlClient.post('/predict/crop', params);
    return data;
  } catch (err) {
    logger.error(`ML predictCrop error: ${err.message}`);
    throw new Error(`Crop prediction failed: ${err.response?.data?.error || err.message}`);
  }
};

/** Pest detection via image upload */
export const detectPest = async (imageBuffer, filename = 'image.jpg') => {
  try {
    const form = new FormData();
    form.append('image', imageBuffer, { filename, contentType: 'image/jpeg' });

    const { data } = await mlClient.post('/predict/pest', form, {
      headers: form.getHeaders(),
      maxContentLength: 10 * 1024 * 1024,
    });
    return data;
  } catch (err) {
    logger.error(`ML detectPest error: ${err.message}`);
    throw new Error(`Pest detection failed: ${err.response?.data?.error || err.message}`);
  }
};

/** Irrigation plan via ML model */
export const planIrrigation = async (params) => {
  try {
    const { data } = await mlClient.post('/predict/irrigation', params);
    return data;
  } catch (err) {
    logger.error(`ML planIrrigation error: ${err.message}`);
    throw new Error(`Irrigation planning failed: ${err.response?.data?.error || err.message}`);
  }
};

/** Get crop info */
export const getCropInfo = async (cropName) => {
  try {
    const { data } = await mlClient.get(`/crop/info/${cropName}`);
    return data;
  } catch (err) {
    logger.error(`ML getCropInfo error: ${err.message}`);
    throw new Error(`Crop info failed: ${err.response?.data?.error || err.message}`);
  }
};

export const mlService = { checkHealth, predictCrop, detectPest, planIrrigation, getCropInfo };
