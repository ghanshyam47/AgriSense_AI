import { mlService } from '../services/ml.service.js';
import { cacheService } from '../services/cache.service.js';
import { geminiService } from '../services/gemini.service.js';

export const recommend = async (req, res, next) => {
  try {
    const params = req.body;
    const cacheKey = `crop:${JSON.stringify(params)}`;
    
    const result = await cacheService.getOrSet(cacheKey, async () => {
      const mlResult = await mlService.predictCrop(params);
      const reasoning = await geminiService.addReasoning('crop recommendation', params, mlResult);
      return { prediction: mlResult, reasoning };
    }, cacheService.TTL.CROP);

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getCropInfo = async (req, res, next) => {
  try {
    const { cropName } = req.params;
    const result = await mlService.getCropInfo(cropName);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};
