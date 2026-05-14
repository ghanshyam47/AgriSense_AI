package com.agrisense.server.controller;

import com.agrisense.server.service.MLServiceClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/pest")
public class PestController {

    private final MLServiceClient mlServiceClient;

    public PestController(MLServiceClient mlServiceClient) {
        this.mlServiceClient = mlServiceClient;
    }

    @PostMapping("/detect")
    public ResponseEntity<Map<?, ?>> detect(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No image provided"));
        }
        // Validate file type
        String contentType = image.getContentType();
        if (contentType == null || (!contentType.contains("jpeg") && !contentType.contains("png")
                && !contentType.contains("webp") && !contentType.contains("bmp"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid file type. Accepted: jpg, png, webp, bmp"));
        }
        Map<?, ?> result = mlServiceClient.predictPest(image);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/common/{crop}")
    public ResponseEntity<Map<?, ?>> commonPests(@PathVariable String crop) {
        Map<?, ?> result = mlServiceClient.getCommonPests(crop);
        return ResponseEntity.ok(result);
    }
}
