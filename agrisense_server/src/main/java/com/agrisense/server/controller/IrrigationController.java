package com.agrisense.server.controller;

import com.agrisense.server.service.MLServiceClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/irrigation")
public class IrrigationController {

    private final MLServiceClient mlServiceClient;

    public IrrigationController(MLServiceClient mlServiceClient) {
        this.mlServiceClient = mlServiceClient;
    }

    @PostMapping("/plan")
    public ResponseEntity<Map<?, ?>> plan(@RequestBody Map<String, Object> payload) {
        Map<?, ?> result = mlServiceClient.predictIrrigation(payload);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> today() {
        // Returns a default recommendation; in a real system this would use current weather + user's crop data
        return ResponseEntity.ok(Map.of(
                "irrigate", true,
                "amount_mm", 20,
                "reason", "Default recommendation — connect your farm profile for personalized advice."
        ));
    }
}
