import cron from 'node-cron';
import User from '../models/User.js';
import FarmProfile from '../models/FarmProfile.js';
import { alertService } from '../services/alert.service.js';
import { logger } from '../utils/logger.js';

/**
 * Weather Alert Job — Runs every 3 hours
 * Checks weather forecast for all registered users and generates smart alerts.
 */
export const startWeatherAlertJob = () => {
  // Run every 3 hours: 0 */3 * * *
  cron.schedule('0 */3 * * *', async () => {
    logger.info('⏰ [CRON] Weather alert job starting...');
    try {
      const users = await User.find({ 'location.lat': { $exists: true } }).lean();
      let totalAlerts = 0;

      for (const user of users) {
        try {
          const farm = await FarmProfile.findOne({ userId: user._id }).lean();
          const crops = farm?.currentCrops || [];

          const alerts = await alertService.evaluateWeatherAlerts(
            user._id, user.location.lat, user.location.lng, crops
          );
          totalAlerts += alerts.length;
        } catch (err) {
          logger.warn(`Weather alert failed for user ${user._id}: ${err.message}`);
        }
      }

      logger.info(`✅ [CRON] Weather alert job done — ${totalAlerts} alerts created for ${users.length} users`);
    } catch (err) {
      logger.error(`❌ [CRON] Weather alert job error: ${err.message}`);
    }
  });

  logger.info('📅 Weather alert job scheduled (every 3 hours)');
};
