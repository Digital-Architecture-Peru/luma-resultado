package com.example.cuentas.notificaciones.api;

import com.example.cuentas.notificaciones.api.dto.NotificationResponse;
import com.example.cuentas.notificaciones.api.dto.PreferenceRequest;
import com.example.cuentas.notificaciones.api.dto.PreferenceResponse;
import com.example.cuentas.notificaciones.application.NotificationService;
import com.example.cuentas.notificaciones.application.PreferenceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import java.util.UUID;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1")
public class NotificationController {

    private static final String ACCOUNT_REGEX = "[A-Za-z0-9]{4,20}";

    private final NotificationService notifications;
    private final PreferenceService preferences;

    public NotificationController(NotificationService notifications, PreferenceService preferences) {
        this.notifications = notifications;
        this.preferences = preferences;
    }

    @GetMapping("/accounts/{accountId}/notifications")
    public List<NotificationResponse> list(
            @PathVariable @Pattern(regexp = ACCOUNT_REGEX) String accountId,
            @RequestParam(defaultValue = "ALL") @Pattern(regexp = "UNREAD|ALL") String status,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        boolean unreadOnly = "UNREAD".equals(status);
        return notifications.list(accountId, unreadOnly, page, size).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @PatchMapping("/notifications/{id}/read")
    public NotificationResponse markRead(@PathVariable UUID id) {
        return NotificationResponse.from(notifications.markRead(id));
    }

    @GetMapping("/accounts/{accountId}/notification-preferences")
    public PreferenceResponse getPreferences(
            @PathVariable @Pattern(regexp = ACCOUNT_REGEX) String accountId) {
        return PreferenceResponse.from(preferences.get(accountId));
    }

    @PutMapping("/accounts/{accountId}/notification-preferences")
    public PreferenceResponse updatePreferences(
            @PathVariable @Pattern(regexp = ACCOUNT_REGEX) String accountId,
            @Valid @RequestBody PreferenceRequest request) {
        return PreferenceResponse.from(preferences.update(accountId,
                request.lowBalanceThreshold(), request.depositEnabled(), request.withdrawalEnabled()));
    }
}
