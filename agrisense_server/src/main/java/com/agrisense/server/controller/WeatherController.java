package com.agrisense.server.controller;

import com.agrisense.server.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/forecast")
    public ResponseEntity<Map<?, ?>> forecast(
            @RequestParam(required = false) String lat,
            @RequestParam(required = false) String lon,
            @RequestParam(required = false) String city) {
        if ((lat == null || lon == null) && city == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Provide lat+lon or city"));
        }
        return ResponseEntity.ok(weatherService.getForecast(lat, lon, city));
    }

    @GetMapping("/current")
    public ResponseEntity<Map<?, ?>> current(
            @RequestParam(required = false) String lat,
            @RequestParam(required = false) String lon,
            @RequestParam(required = false) String city) {
        if ((lat == null || lon == null) && city == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Provide lat+lon or city"));
        }
        return ResponseEntity.ok(weatherService.getCurrentWeather(lat, lon, city));
    }

    @GetMapping("/agri-alerts")
    public ResponseEntity<Map<String, Object>> agriAlerts(
            @RequestParam(required = false) String lat,
            @RequestParam(required = false) String lon,
            @RequestParam(required = false) String city) {
        if ((lat == null || lon == null) && city == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Provide lat+lon or city"));
        }
        return ResponseEntity.ok(weatherService.getAgriAlerts(lat, lon, city));
    }
}
