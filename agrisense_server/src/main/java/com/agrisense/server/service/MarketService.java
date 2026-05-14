package com.agrisense.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MarketService {

    private static final Logger log = LoggerFactory.getLogger(MarketService.class);

    private final StringRedisTemplate redisTemplate;
    private final GeminiAiService geminiAiService;

    // In-memory fallback / mock data for market prices
    // In production, this would be fetched from government APIs or external data sources
    private static final Map<String, List<Map<String, Object>>> MOCK_PRICES = new ConcurrentHashMap<>();
    private static final Map<String, Map<String, Object>> MSP_DATA = new ConcurrentHashMap<>();

    static {
        MOCK_PRICES.put("wheat", List.of(
                Map.of("mandi", "Ludhiana", "price", 2200, "unit", "₹/quintal", "date", "2026-05-02"),
                Map.of("mandi", "Amritsar", "price", 2180, "unit", "₹/quintal", "date", "2026-05-02"),
                Map.of("mandi", "Karnal", "price", 2210, "unit", "₹/quintal", "date", "2026-05-02")
        ));
        MOCK_PRICES.put("rice", List.of(
                Map.of("mandi", "Ludhiana", "price", 3500, "unit", "₹/quintal", "date", "2026-05-02"),
                Map.of("mandi", "Patna", "price", 3450, "unit", "₹/quintal", "date", "2026-05-02")
        ));
        MOCK_PRICES.put("cotton", List.of(
                Map.of("mandi", "Rajkot", "price", 6200, "unit", "₹/quintal", "date", "2026-05-02"),
                Map.of("mandi", "Nagpur", "price", 6100, "unit", "₹/quintal", "date", "2026-05-02")
        ));

        MSP_DATA.put("wheat", Map.of("msp", 2275, "unit", "₹/quintal", "season", "rabi 2025-26"));
        MSP_DATA.put("rice", Map.of("msp", 2320, "unit", "₹/quintal", "season", "kharif 2025-26"));
        MSP_DATA.put("cotton", Map.of("msp", 7121, "unit", "₹/quintal", "season", "kharif 2025-26"));
    }

    public MarketService(StringRedisTemplate redisTemplate, GeminiAiService geminiAiService) {
        this.redisTemplate = redisTemplate;
        this.geminiAiService = geminiAiService;
    }

    public Map<String, Object> getPrices(String crop) {
        List<Map<String, Object>> prices = MOCK_PRICES.getOrDefault(crop.toLowerCase(), List.of());
        return Map.of("crop", crop, "prices", prices);
    }

    public Map<String, Object> getMsp(String crop) {
        Map<String, Object> msp = MSP_DATA.get(crop.toLowerCase());
        if (msp == null) {
            return Map.of("crop", crop, "msp", 0, "unit", "₹/quintal", "season", "unknown");
        }
        Map<String, Object> result = new HashMap<>(msp);
        result.put("crop", crop);
        return result;
    }

    public Map<String, Object> getTrend(String crop) {
        // Generate mock 30-day trend data
        List<Map<String, Object>> trend = new ArrayList<>();
        Random rand = new Random(crop.hashCode());
        int basePrice = switch (crop.toLowerCase()) {
            case "wheat" -> 2100;
            case "rice" -> 3300;
            case "cotton" -> 5900;
            default -> 2000;
        };
        for (int i = 29; i >= 0; i--) {
            int priceVariation = rand.nextInt(200) - 100;
            trend.add(Map.of(
                    "date", java.time.LocalDate.now().minusDays(i).toString(),
                    "price", basePrice + priceVariation
            ));
        }
        return Map.of("crop", crop, "trend", trend);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getAdvice(String crop) {
        Map<String, Object> trendData = getTrend(crop);
        List<Map<String, Object>> trend = (List<Map<String, Object>>) trendData.get("trend");
        try {
            String aiResponse = geminiAiService.generateMarketAdvice(crop, trend);
            // Try to parse JSON from the AI response
            return Map.of("crop", crop, "rawAdvice", aiResponse);
        } catch (Exception e) {
            log.warn("AI advice failed for {}: {}", crop, e.getMessage());
            return Map.of("crop", crop, "advice", "hold",
                    "reasoning", "Unable to generate AI advice. Market is stable.",
                    "confidence", "low");
        }
    }
}
