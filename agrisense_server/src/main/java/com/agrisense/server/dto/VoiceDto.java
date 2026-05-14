package com.agrisense.server.dto;

import lombok.Data;

public class VoiceDto {

    @Data
    public static class TranslateRequest {
        private String text;
        private String from;
        private String to;
    }

    @Data
    public static class TranslateResponse {
        private String translatedText;
        private String from;
        private String to;

        public TranslateResponse(String translatedText, String from, String to) {
            this.translatedText = translatedText;
            this.from = from;
            this.to = to;
        }
    }
}
