import { marketService } from '../services/market.service.js';

export const getPrices = async (req, res, next) => {
  try {
    const { crop } = req.params;
    const { state } = req.query;
    const result = await marketService.getPrices(crop, state);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getMSP = async (req, res, next) => {
  try {
    const { crop } = req.params;
    const result = await marketService.getMSP(crop);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getTrend = async (req, res, next) => {
  try {
    const { crop } = req.params;
    const { state, days } = req.query;
    const result = await marketService.getTrend(crop, state, parseInt(days) || 7);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getAdvice = async (req, res, next) => {
  try {
    const { crop } = req.params;
    const { state } = req.query;
    const result = await marketService.comparePriceToMSP(crop, state);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};
