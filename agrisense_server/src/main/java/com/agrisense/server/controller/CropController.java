package com.agrisense.server.controller;

import com.agrisense.server.service.MLServiceClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/crop")
public class CropController {

    private final MLServiceClient mlServiceClient;

    public CropController(MLServiceClient mlServiceClient) {
        this.mlServiceClient = mlServiceClient;
    }

    @PostMapping("/recommend")
    public ResponseEntity<Map<?, ?>> recommend(@RequestBody Map<String, Object> payload) {
        Map<?, ?> result = mlServiceClient.predictCrop(payload);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/info/{cropName}")
    public ResponseEntity<Map<?, ?>> getCropInfo(@PathVariable String cropName) {
        Map<?, ?> result = mlServiceClient.getCropInfo(cropName);
        return ResponseEntity.ok(result);
    }
}
