package com.agrisense.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank @Size(min = 2, max = 100)
        private String name;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
        private String phone;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class UpdateProfileRequest {
        private String name;
        private String phone;
    }

    @Data
    public static class UpdateFarmRequest {
        private String farmName;
        private String location;
        private Double areaHectares;
        private String soilType;
        private java.util.List<String> primaryCrops;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String id;
        private String name;
        private String email;

        public AuthResponse(String token, String id, String name, String email) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
        }
    }
}
