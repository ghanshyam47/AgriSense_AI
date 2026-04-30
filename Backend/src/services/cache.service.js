import redis from '../config/redis.js';
import { logger } from '../utils/logger.js';

/** Redis caching abstraction with tiered TTLs */
const TTL = {
  WEATHER: 30 * 60,         // 30 minutes
  MARKET: 60 * 60,          // 1 hour
  CROP: 24 * 60 * 60,       // 24 hours
  PEST: 12 * 60 * 60,       // 12 hours
  MSP: 7 * 24 * 60 * 60,    // 7 days
  SHORT: 5 * 60,            // 5 minutes
};

const get = async (key) => {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    if (data) {
      logger.info(`Cache HIT: ${key}`);
      return JSON.parse(data);
    }
    logger.info(`Cache MISS: ${key}`);
    return null;
  } catch (err) {
    logger.warn(`Cache GET error: ${err.message}`);
    return null;
  }
};

const set = async (key, value, ttl = TTL.SHORT) => {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
    logger.info(`Cache SET: ${key} (TTL: ${ttl}s)`);
  } catch (err) {
    logger.warn(`Cache SET error: ${err.message}`);
  }
};

const invalidate = async (pattern) => {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.info(`Cache INVALIDATE: ${keys.length} keys matching ${pattern}`);
    }
  } catch (err) {
    logger.warn(`Cache INVALIDATE error: ${err.message}`);
  }
};

/** Get cached value or fetch & cache it */
const getOrSet = async (key, fetchFn, ttl = TTL.SHORT) => {
  const cached = await get(key);
  if (cached) return cached;
  const fresh = await fetchFn();
  await set(key, fresh, ttl);
  return fresh;
};

export const cacheService = { get, set, invalidate, getOrSet, TTL };
