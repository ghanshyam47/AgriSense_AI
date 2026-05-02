import { mlService } from '../services/ml.service.js';
import { cacheService } from '../services/cache.service.js';
import crypto from 'crypto';
import { aiService } from '../services/ai.service.js';

export const detect = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded. Use field name "image".' });

    // Cache by image hash
    const imageHash = crypto.createHash('md5').update(req.file.buffer).digest('hex').slice(0, 12);
    const cacheKey = `pest:${imageHash}`;

    const result = await cacheService.getOrSet(cacheKey, async () => {
      const mlResult = await mlService.detectPest(req.file.buffer, req.file.originalname);
      const reasoning = await aiService.addReasoning('pest detection', { filename: req.file.originalname }, mlResult);
      return { prediction: mlResult, reasoning };
    }, cacheService.TTL.PEST);

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getCommonPests = async (req, res, next) => {
  try {
    const { crop } = req.params;
    // Fetch from ML service
    const { data } = await (await import('axios')).default
      .get(`${(await import('../config/env.js')).config.ML_SERVICE_URL}/pest/common/${crop}`);
    res.json({ success: true, data: data.data || data });
  } catch (err) { next(err); }
};
