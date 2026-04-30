import cron from 'node-cron';
import User from '../models/User.js';
import FarmProfile from '../models/FarmProfile.js';
import { marketService } from '../services/market.service.js';
import { alertService } from '../services/alert.service.js';
import { logger } from '../utils/logger.js';

/**
 * Market Sync Job — Runs every 6 hours
 * Fetches latest market prices, persists to MongoDB, and generates market alerts.
 */
export const startMarketSyncJob = () => {
  // Run every 6 hours: 0 */6 * * *
  cron.schedule('0 */6 * * *', async () => {
    logger.info('⏰ [CRON] Market sync job starting...');
    try {
      // Step 1: Sync market prices to DB
      await marketService.syncMarketPrices();

      // Step 2: Generate market alerts for users with crops
      const farms = await FarmProfile.find({ currentCrops: { $exists: true, $ne: [] } }).lean();
      let totalAlerts = 0;

      for (const farm of farms) {
        try {
          const alerts = await alertService.evaluateMarketAlerts(farm.userId, farm.currentCrops);
          totalAlerts += alerts.length;
        } catch (err) {
          logger.warn(`Market alert failed for user ${farm.userId}: ${err.message}`);
        }
      }

      logger.info(`✅ [CRON] Market sync done — ${totalAlerts} alerts created`);
    } catch (err) {
      logger.error(`❌ [CRON] Market sync job error: ${err.message}`);
    }
  });

  logger.info('📅 Market sync job scheduled (every 6 hours)');
};
