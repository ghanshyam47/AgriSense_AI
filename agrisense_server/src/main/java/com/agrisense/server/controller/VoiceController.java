package com.agrisense.server.controller;

import com.agrisense.server.dto.VoiceDto;
import com.agrisense.server.model.User;
import com.agrisense.server.service.GeminiAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/voice")
public class VoiceController {

    private final GeminiAiService geminiAiService;

    public VoiceController(GeminiAiService geminiAiService) {
        this.geminiAiService = geminiAiService;
    }

    @PostMapping("/translate")
    public ResponseEntity<VoiceDto.TranslateResponse> translate(@RequestBody VoiceDto.TranslateRequest req) {
        String prompt = String.format("Translate the following text from %s to %s. " +
                "Return ONLY the translated text, nothing else.\n\nText: %s", req.getFrom(), req.getTo(), req.getText());
        String translated = geminiAiService.callGemini(prompt);
        return ResponseEntity.ok(new VoiceDto.TranslateResponse(translated.trim(), req.getFrom(), req.getTo()));
    }

    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processVoice(
            @AuthenticationPrincipal User user,
            @RequestParam("audio") MultipartFile audio,
            @RequestParam(value = "language", defaultValue = "en") String language) {
        // In a real implementation, this would transcribe audio using a speech-to-text service.
        // For now, we return a placeholder indicating the feature is available.
        String sessionId = user != null ? user.getId() : "anon-" + UUID.randomUUID();
        return ResponseEntity.ok(Map.of(
                "transcript", "[Audio transcription not implemented — connect a speech-to-text service]",
                "reply", "Voice processing requires a speech-to-text integration (e.g., Google Cloud Speech).",
                "sessionId", sessionId
        ));
    }
}
