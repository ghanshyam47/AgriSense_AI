import Redis from 'ioredis';
import { config } from './env.js';
import { logger } from '../utils/logger.js';


let redis = null;
let initialized = false;

const initRedis = () => {
  if (initialized) return redis;
  initialized = true;

  try {
    redis = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn('⚠️  Redis: max retries reached — running without cache');
          return null;
        }
        return Math.min(times * 500, 3000);
      },
      lazyConnect: true,
    });

    redis.on('connect', () => logger.info('✅ Redis connected'));
    redis.on('error', (err) => {
      logger.warn(`⚠️  Redis error: ${err.message}`);
    });
    redis.on('close', () => logger.warn('⚠️  Redis connection closed'));

    redis.connect().catch(() => {
      logger.warn('⚠️  Redis unavailable — caching disabled');
      redis = null;
    });
  } catch (error) {
    logger.warn(`⚠️  Redis initialization failed: ${error.message} — caching disabled`);
    redis = null;
  }

  return redis;
};

// Initialize on first import
initRedis();

export const getRedis = () => redis;
export default redis;
