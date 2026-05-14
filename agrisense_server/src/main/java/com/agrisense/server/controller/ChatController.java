package com.agrisense.server.controller;

import com.agrisense.server.dto.ChatDto;
import com.agrisense.server.model.User;
import com.agrisense.server.service.GeminiAiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GeminiAiService geminiAiService;

    public ChatController(GeminiAiService geminiAiService) {
        this.geminiAiService = geminiAiService;
    }

    @PostMapping("/message")
    public ResponseEntity<ChatDto.MessageResponse> sendMessage(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChatDto.MessageRequest req) {
        // Use user ID as session or generate anonymous session
        String sessionId = user != null ? user.getId() : "anon-" + UUID.randomUUID();
        String reply = geminiAiService.chat(sessionId, req.getMessage(), req.getLanguage());
        return ResponseEntity.ok(new ChatDto.MessageResponse(reply, sessionId));
    }

    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getHistory(@AuthenticationPrincipal User user) {
        String sessionId = user != null ? user.getId() : "anon";
        List<Map<String, String>> messages = geminiAiService.getHistory(sessionId);
        return ResponseEntity.ok(Map.of("messages", messages));
    }

    @DeleteMapping("/history")
    public ResponseEntity<Map<String, Object>> clearHistory(@AuthenticationPrincipal User user) {
        String sessionId = user != null ? user.getId() : "anon";
        geminiAiService.clearHistory(sessionId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Chat history cleared"));
    }
}
