package com.agrisense.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.Map;

public class CropDto {

    @Data
    public static class SimpleRecommendRequest {
        private String soil_condition;
        private String season;
        private Double temperature;
        private Double humidity;
        private Double rainfall;
    }

    @Data
    public static class TechnicalRecommendRequest {
        private Double N;
        private Double P;
        private Double K;
        private Double temperature;
        private Double humidity;
        private Double ph;
        private Double rainfall;
    }

    @Data
    public static class RecommendResponse {
        private boolean success;
        private List<Map<String, Object>> recommendations;

        public RecommendResponse(boolean success, List<Map<String, Object>> recommendations) {
            this.success = success;
            this.recommendations = recommendations;
        }
    }
}
