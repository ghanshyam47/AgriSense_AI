package com.agrisense.server.controller;

import com.agrisense.server.model.Alert;
import com.agrisense.server.model.User;
import com.agrisense.server.service.AlertService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAlerts(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "false") boolean unread) {
        Page<Alert> alerts = alertService.getAlerts(user.getId(), page, limit, unread);
        List<Map<String, Object>> alertList = alerts.getContent().stream().map(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("_id", a.getId());
            m.put("type", a.getType().name().toLowerCase());
            m.put("title", a.getTitle());
            m.put("message", a.getMessage());
            m.put("read", a.isRead());
            m.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "alerts", alertList,
                "total", alerts.getTotalElements(),
                "page", page
        ));
    }

    @GetMapping("/unread")
    public ResponseEntity<Map<String, Object>> unreadCount(@AuthenticationPrincipal User user) {
        long count = alertService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        alertService.markAsRead(id, user.getId());
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAlert(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        alertService.deleteAlert(id, user.getId());
        return ResponseEntity.ok(Map.of("success", true));
    }
}
