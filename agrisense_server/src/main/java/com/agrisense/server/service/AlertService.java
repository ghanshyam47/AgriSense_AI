package com.agrisense.server.service;

import com.agrisense.server.model.Alert;
import com.agrisense.server.model.User;
import com.agrisense.server.repository.AlertRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public AlertService(AlertRepository alertRepository, SimpMessagingTemplate messagingTemplate) {
        this.alertRepository = alertRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Page<Alert> getAlerts(String userId, int page, int limit, boolean unreadOnly) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (unreadOnly) {
            return alertRepository.findByUserIdAndRead(userId, false, pageRequest);
        }
        return alertRepository.findByUserId(userId, pageRequest);
    }

    public long getUnreadCount(String userId) {
        return alertRepository.countByUserIdAndRead(userId, false);
    }

    @Transactional
    public void markAsRead(String alertId, String userId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found"));
        if (!alert.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        alert.setRead(true);
        alertRepository.save(alert);
    }

    @Transactional
    public void deleteAlert(String alertId, String userId) {
        alertRepository.deleteByIdAndUserId(alertId, userId);
    }

    @Transactional
    public Alert createAndPush(User user, Alert.AlertType type, String title, String message) {
        Alert alert = Alert.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .build();
        alert = alertRepository.save(alert);

        // Push via WebSocket to the user's personal queue
        messagingTemplate.convertAndSendToUser(
                user.getId(),
                "/queue/alerts",
                Map.of("type", type.name(), "title", title, "message", message, "id", alert.getId())
        );
        return alert;
    }
}
