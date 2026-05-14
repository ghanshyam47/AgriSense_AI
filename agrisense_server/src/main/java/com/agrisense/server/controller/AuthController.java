package com.agrisense.server.controller;

import com.agrisense.server.dto.AuthDto;
import com.agrisense.server.model.FarmProfile;
import com.agrisense.server.model.User;
import com.agrisense.server.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal User user) {
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("phone", user.getPhone());
        if (user.getFarmProfile() != null) {
            FarmProfile fp = user.getFarmProfile();
            Map<String, Object> farm = new LinkedHashMap<>();
            farm.put("farmName", fp.getFarmName());
            farm.put("location", fp.getLocation());
            farm.put("areaHectares", fp.getAreaHectares());
            farm.put("soilType", fp.getSoilType());
            farm.put("primaryCrops", fp.getPrimaryCrops());
            profile.put("farmProfile", farm);
        }
        return ResponseEntity.ok(profile);
    }

    @PatchMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody AuthDto.UpdateProfileRequest req) {
        User updated = authService.updateProfile(user.getId(), req);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", updated.getId());
        result.put("name", updated.getName());
        result.put("email", updated.getEmail());
        result.put("phone", updated.getPhone());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/farm")
    public ResponseEntity<Map<String, Object>> updateFarm(
            @AuthenticationPrincipal User user,
            @RequestBody AuthDto.UpdateFarmRequest req) {
        FarmProfile fp = authService.updateFarmProfile(user.getId(), req);
        Map<String, Object> farm = new LinkedHashMap<>();
        farm.put("farmName", fp.getFarmName());
        farm.put("location", fp.getLocation());
        farm.put("areaHectares", fp.getAreaHectares());
        farm.put("soilType", fp.getSoilType());
        farm.put("primaryCrops", fp.getPrimaryCrops());
        return ResponseEntity.ok(farm);
    }
}
