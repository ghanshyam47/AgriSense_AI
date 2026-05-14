package com.agrisense.server.service;

import com.agrisense.server.dto.AuthDto;
import com.agrisense.server.model.FarmProfile;
import com.agrisense.server.model.User;
import com.agrisense.server.repository.FarmProfileRepository;
import com.agrisense.server.repository.UserRepository;
import com.agrisense.server.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final FarmProfileRepository farmProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       FarmProfileRepository farmProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.farmProfileRepository = farmProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .build();
        userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthDto.AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthDto.AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    @Transactional
    public User updateProfile(String userId, AuthDto.UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        return userRepository.save(user);
    }

    @Transactional
    public FarmProfile updateFarmProfile(String userId, AuthDto.UpdateFarmRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        FarmProfile farm = farmProfileRepository.findByUserId(userId).orElse(
                FarmProfile.builder().user(user).build());
        if (req.getFarmName() != null) farm.setFarmName(req.getFarmName());
        if (req.getLocation() != null) farm.setLocation(req.getLocation());
        if (req.getAreaHectares() != null) farm.setAreaHectares(req.getAreaHectares());
        if (req.getSoilType() != null) farm.setSoilType(req.getSoilType());
        if (req.getPrimaryCrops() != null) farm.setPrimaryCrops(req.getPrimaryCrops());
        return farmProfileRepository.save(farm);
    }
}
