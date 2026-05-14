package com.agrisense.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    @Value("${app.weather.api-key}")
    private String apiKey;

    @Value("${app.weather.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<?, ?> getForecast(String lat, String lon, String city) {
        String url = buildUrl("/forecast", lat, lon, city);
        try {
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.error("Weather forecast failed: {}", e.getMessage());
            throw new RuntimeException("Weather service error: " + e.getMessage());
        }
    }

    public Map<?, ?> getCurrentWeather(String lat, String lon, String city) {
        String url = buildUrl("/weather", lat, lon, city);
        try {
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.error("Current weather failed: {}", e.getMessage());
            throw new RuntimeException("Weather service error: " + e.getMessage());
        }
    }

    public Map<String, Object> getAgriAlerts(String lat, String lon, String city) {
        try {
            Map<?, ?> weather = getCurrentWeather(lat, lon, city);
            List<Map<String, String>> alerts = new ArrayList<>();

            if (weather != null && weather.containsKey("main")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> main = (Map<String, Object>) weather.get("main");
                double temp = ((Number) main.get("temp")).doubleValue() - 273.15; // Kelvin to Celsius
                double humidity = ((Number) main.get("humidity")).doubleValue();

                if (temp > 38) {
                    alerts.add(Map.of("type", "heat_stress", "severity", "high",
                            "message", "Temperatures above 38°C — irrigate early morning to protect crops."));
                } else if (temp < 5) {
                    alerts.add(Map.of("type", "frost_risk", "severity", "high",
                            "message", "Frost risk detected — cover sensitive seedlings tonight."));
                }
                if (humidity > 90) {
                    alerts.add(Map.of("type", "fungal_risk", "severity", "medium",
                            "message", "High humidity — monitor crops for fungal diseases."));
                }
            }

            return Map.of("alerts", alerts);
        } catch (Exception e) {
            log.error("Agri alerts failed: {}", e.getMessage());
            return Map.of("alerts", List.of());
        }
    }

    private String buildUrl(String path, String lat, String lon, String city) {
        if (lat != null && lon != null) {
            return String.format("%s%s?lat=%s&lon=%s&appid=%s", baseUrl, path, lat, lon, apiKey);
        }
        return String.format("%s%s?q=%s&appid=%s", baseUrl, path, city, apiKey);
    }
}
