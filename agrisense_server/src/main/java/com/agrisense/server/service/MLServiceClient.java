package com.agrisense.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

@Service
public class MLServiceClient {

    private static final Logger log = LoggerFactory.getLogger(MLServiceClient.class);

    @Value("${app.ml-service.url}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate;

    public MLServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<?, ?> checkHealth() {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(mlServiceUrl + "/health", Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.warn("ML Service health check failed: {}", e.getMessage());
            return Map.of("status", "unavailable", "error", e.getMessage());
        }
    }

    public Map<?, ?> predictCrop(Map<String, Object> payload) {
        return postJson("/predict/crop", payload);
    }

    public Map<?, ?> getCropInfo(String cropName) {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(
                    mlServiceUrl + "/crop/info/" + cropName, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Get crop info failed: {}", e.getMessage());
            throw new RuntimeException("ML Service error: " + e.getMessage());
        }
    }

    public Map<?, ?> predictPest(MultipartFile image) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(image.getBytes()) {
                @Override public String getFilename() { return image.getOriginalFilename(); }
            };
            body.add("image", resource);

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    mlServiceUrl + "/predict/pest", entity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Pest detection failed: {}", e.getMessage());
            throw new RuntimeException("ML Service error: " + e.getMessage());
        }
    }

    public Map<?, ?> getCommonPests(String crop) {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(
                    mlServiceUrl + "/pest/common/" + crop, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Get common pests failed: {}", e.getMessage());
            throw new RuntimeException("ML Service error: " + e.getMessage());
        }
    }

    public Map<?, ?> predictIrrigation(Map<String, Object> payload) {
        return postJson("/predict/irrigation", payload);
    }

    private Map<?, ?> postJson(String path, Map<String, Object> payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    mlServiceUrl + path, entity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("ML Service call to {} failed: {}", path, e.getMessage());
            throw new RuntimeException("ML Service error: " + e.getMessage());
        }
    }
}
