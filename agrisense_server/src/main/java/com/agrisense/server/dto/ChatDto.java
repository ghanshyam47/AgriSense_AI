package com.agrisense.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class ChatDto {

    @Data
    public static class MessageRequest {
        @NotBlank
        private String message;
        private String language = "en";
    }

    @Data
    public static class MessageResponse {
        private String reply;
        private String sessionId;

        public MessageResponse(String reply, String sessionId) {
            this.reply = reply;
            this.sessionId = sessionId;
        }
    }
}
