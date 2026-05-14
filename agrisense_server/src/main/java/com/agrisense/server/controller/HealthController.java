package com.agrisense.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final long startTime = System.currentTimeMillis();

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        double uptime = (System.currentTimeMillis() - startTime) / 1000.0;
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "service", "AgriSense Backend",
                "timestamp", Instant.now().toString(),
                "uptime", uptime
        ));
    }
}
