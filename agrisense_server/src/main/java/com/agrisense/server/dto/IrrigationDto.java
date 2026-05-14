package com.agrisense.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.Map;

public class IrrigationDto {

    @Data
    public static class PlanRequest {
        @NotBlank
        private String crop;
        @NotBlank
        private String soil_type;
        @NotNull
        private Double temperature;
        @NotNull
        private Double humidity;
        @NotNull
        @Size(min = 5, max = 5)
        private List<Double> rainfall_forecast;
        private Double wind_speed;
        private String crop_stage;
    }

    @Data
    public static class PlanResponse {
        private boolean success;
        private Map<String, Object> plan;

        public PlanResponse(boolean success, Map<String, Object> plan) {
            this.success = success;
            this.plan = plan;
        }
    }
}
