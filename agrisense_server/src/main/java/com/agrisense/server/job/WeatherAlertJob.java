package com.agrisense.server.job;

import com.agrisense.server.model.Alert;
import com.agrisense.server.model.User;
import com.agrisense.server.repository.UserRepository;
import com.agrisense.server.service.AlertService;
import com.agrisense.server.service.WeatherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class WeatherAlertJob {

    private static final Logger log = LoggerFactory.getLogger(WeatherAlertJob.class);

    private final UserRepository userRepository;
    private final WeatherService weatherService;
    private final AlertService alertService;

    public WeatherAlertJob(UserRepository userRepository, WeatherService weatherService, AlertService alertService) {
        this.userRepository = userRepository;
        this.weatherService = weatherService;
        this.alertService = alertService;
    }

    // Runs every hour
    @Scheduled(fixedRate = 3600000)
    public void checkWeatherAlerts() {
        log.info("🌦️ Weather Alert Job — running...");
        try {
            List<User> users = userRepository.findAll();
            for (User user : users) {
                if (user.getFarmProfile() != null && user.getFarmProfile().getLocation() != null) {
                    String city = user.getFarmProfile().getLocation().split(",")[0].trim();
                    try {
                        Map<String, Object> alertData = weatherService.getAgriAlerts(null, null, city);
                        @SuppressWarnings("unchecked")
                        List<Map<String, String>> alerts = (List<Map<String, String>>) alertData.get("alerts");
                        for (Map<String, String> alert : alerts) {
                            alertService.createAndPush(
                                    user,
                                    Alert.AlertType.WEATHER,
                                    alert.getOrDefault("type", "Weather Alert"),
                                    alert.getOrDefault("message", "Check weather conditions for your area.")
                            );
                        }
                    } catch (Exception e) {
                        log.warn("Weather alert failed for user {}: {}", user.getId(), e.getMessage());
                    }
                }
            }
            log.info("🌦️ Weather Alert Job — complete.");
        } catch (Exception e) {
            log.error("Weather Alert Job error: {}", e.getMessage());
        }
    }
}
