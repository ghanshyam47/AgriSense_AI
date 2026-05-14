package com.agrisense.server.job;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class MarketSyncJob {

    private static final Logger log = LoggerFactory.getLogger(MarketSyncJob.class);

    private final StringRedisTemplate redisTemplate;

    public MarketSyncJob(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Runs every 6 hours
    @Scheduled(fixedRate = 21600000)
    public void syncMarketPrices() {
        log.info("📊 Market Sync Job — running...");
        try {
            // In production, this would fetch from government mandi APIs (e.g., data.gov.in)
            // and cache the results in Redis.
            // For now we update a heartbeat key to verify the job runs.
            redisTemplate.opsForValue().set("market:lastSync",
                    java.time.Instant.now().toString(), Duration.ofHours(7));
            log.info("📊 Market Sync Job — complete. Last sync cached in Redis.");
        } catch (Exception e) {
            log.error("Market Sync Job error: {}", e.getMessage());
        }
    }
}
