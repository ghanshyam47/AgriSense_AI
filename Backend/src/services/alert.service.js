import Alert from '../models/Alert.js';
import { weatherService } from './weather.service.js';
import { marketService } from './market.service.js';
import { logger } from '../utils/logger.js';

/**
 * Smart Alert Rules Engine
 * Combines weather + crop + market data to generate actionable alerts.
 */

/** Evaluate weather-based alerts for a user */
export const evaluateWeatherAlerts = async (userId, lat, lng, crops = []) => {
  const alerts = await weatherService.getAgriculturalAlerts(lat, lng);
  const created = [];

  for (const alert of alerts) {
    // Check if similar alert already exists (avoid duplicates)
    const existing = await Alert.findOne({
      userId, type: alert.type, title: alert.title,
      createdAt: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) }, // within 6h
    });
    if (existing) continue;

    const doc = await Alert.create({
      userId, type: alert.type, severity: alert.severity,
      title: alert.title, message: alert.message, actionable: alert.actionable,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h expiry
    });
    created.push(doc);
  }

  return created;
};

/** Evaluate market-based alerts for a user's crops */
export const evaluateMarketAlerts = async (userId, crops = []) => {
  const created = [];

  for (const crop of crops) {
    try {
      const comparison = await marketService.comparePriceToMSP(crop);
      if (!comparison.comparison === null) continue;

      // Alert if price is significantly above or below MSP
      if (comparison.difference_percent > 15) {
        const existing = await Alert.findOne({
          userId, type: 'market', title: new RegExp(crop, 'i'),
          createdAt: { $gte: new Date(Date.now() - 12 * 60 * 60 * 1000) },
        });
        if (existing) continue;

        const doc = await Alert.create({
          userId, type: 'market', severity: 'medium',
          title: `${crop.charAt(0).toUpperCase() + crop.slice(1)} Price Above MSP`,
          message: `${crop} market price is ₹${comparison.avg_market_price}/quintal — ${comparison.difference_percent}% above MSP (₹${comparison.msp}).`,
          actionable: 'Consider selling now to maximize profit.',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        created.push(doc);
      } else if (comparison.difference_percent < -10) {
        const existing = await Alert.findOne({
          userId, type: 'market', title: new RegExp(crop, 'i'),
          createdAt: { $gte: new Date(Date.now() - 12 * 60 * 60 * 1000) },
        });
        if (existing) continue;

        const doc = await Alert.create({
          userId, type: 'market', severity: 'low',
          title: `${crop.charAt(0).toUpperCase() + crop.slice(1)} Price Below MSP`,
          message: `${crop} market price is ₹${comparison.avg_market_price}/quintal — ${Math.abs(comparison.difference_percent)}% below MSP (₹${comparison.msp}).`,
          actionable: 'Consider selling to government agencies at MSP price, or hold if storage is available.',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        created.push(doc);
      }
    } catch (err) {
      logger.warn(`Market alert evaluation failed for ${crop}: ${err.message}`);
    }
  }

  return created;
};

/** Get alerts for a user */
export const getUserAlerts = async (userId, options = {}) => {
  const query = { userId };
  if (options.unreadOnly) query.read = false;
  if (options.type) query.type = options.type;

  return Alert.find(query).sort({ createdAt: -1 }).limit(options.limit || 50).lean();
};

/** Mark alert as read */
export const markAsRead = async (alertId, userId) => {
  return Alert.findOneAndUpdate({ _id: alertId, userId }, { read: true }, { new: true });
};

/** Get unread count */
export const getUnreadCount = async (userId) => {
  return Alert.countDocuments({ userId, read: false });
};

/** Delete alert */
export const deleteAlert = async (alertId, userId) => {
  return Alert.findOneAndDelete({ _id: alertId, userId });
};

export const alertService = {
  evaluateWeatherAlerts, evaluateMarketAlerts,
  getUserAlerts, markAsRead, getUnreadCount, deleteAlert,
};
