package com.agrisense.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiAiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiService.class);
    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    @Value("${app.gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    // Simple in-memory chat history per session
    private final Map<String, List<Map<String, String>>> sessionHistory = new java.util.concurrent.ConcurrentHashMap<>();

    public GeminiAiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String chat(String sessionId, String userMessage, String language) {
        List<Map<String, String>> history = sessionHistory.computeIfAbsent(sessionId, k -> new ArrayList<>());

        // Build system prompt
        String systemPrompt = "You are AgriSense, an expert AI farming assistant helping Indian farmers. " +
                "Provide practical, actionable advice about crop cultivation, irrigation, pest control, " +
                "market prices, and weather impacts. Keep responses concise and farmer-friendly. " +
                "Respond in the same language as the user's message.";

        // Build contents array for Gemini
        List<Map<String, Object>> contents = new ArrayList<>();

        // System role
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", systemPrompt))));
        contents.add(Map.of("role", "model", "parts", List.of(Map.of("text", "Understood. I am AgriSense, ready to help farmers."))));

        // Prior history
        for (Map<String, String> msg : history) {
            String role = "user".equals(msg.get("role")) ? "user" : "model";
            contents.add(Map.of("role", role, "parts", List.of(Map.of("text", msg.get("content")))));
        }

        // Current message
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", userMessage))));

        Map<String, Object> requestBody = Map.of("contents", contents);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = GEMINI_API_URL + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map body = response.getBody();

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            Map<String, Object> candidate = candidates.get(0);
            @SuppressWarnings("unchecked")
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String reply = (String) parts.get(0).get("text");

            // Save to history
            history.add(Map.of("role", "user", "content", userMessage));
            history.add(Map.of("role", "assistant", "content", reply));

            return reply;
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            throw new RuntimeException("AI service unavailable: " + e.getMessage());
        }
    }

    public List<Map<String, String>> getHistory(String sessionId) {
        return sessionHistory.getOrDefault(sessionId, List.of());
    }

    public void clearHistory(String sessionId) {
        sessionHistory.remove(sessionId);
    }

    public String generateMarketAdvice(String crop, List<Map<String, Object>> trend) {
        String prompt = String.format(
                "As an agricultural market expert, analyze the 30-day price trend for %s: %s. " +
                "Give a sell/hold/buy recommendation with brief reasoning. " +
                "Respond as JSON: {\"advice\": \"sell|hold|buy\", \"reasoning\": \"...\", \"confidence\": \"low|medium|high\"}",
                crop, trend.toString());
        return callGemini(prompt);
    }

    public String callGemini(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt)))));
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = GEMINI_API_URL + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> parts = (List<Map<String, Object>>)
                    ((Map<String, Object>) candidates.get(0).get("content")).get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            log.error("Gemini single call failed: {}", e.getMessage());
            throw new RuntimeException("AI service error: " + e.getMessage());
        }
    }
}
