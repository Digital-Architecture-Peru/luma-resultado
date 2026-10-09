package com.banco.notifications.api;

import com.banco.notifications.api.Dtos.CardResponse;
import com.banco.notifications.api.Dtos.NotificationResponse;
import com.banco.notifications.api.Dtos.PageResponse;
import com.banco.notifications.api.Dtos.PreferencesResponse;
import com.banco.notifications.api.Dtos.UpdatePreferencesRequest;
import com.banco.notifications.application.NotificationService;
import com.banco.notifications.domain.NotificationStatus;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** El cliente se identifica con la cabecera ficticia X-Customer-Id (autenticación fuera de alcance). */
@RestController
@RequestMapping("/api/v1")
public class NotificationController {

    private static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping("/cards")
    public List<CardResponse> cards(@RequestHeader(CUSTOMER_HEADER) String customerId) {
        return service.listCards(customerId).stream().map(CardResponse::from).toList();
    }

    @GetMapping("/cards/{cardId}/notifications")
    public PageResponse<NotificationResponse> list(@RequestHeader(CUSTOMER_HEADER) String customerId,
                                                   @PathVariable UUID cardId,
                                                   @RequestParam(required = false) NotificationStatus status,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        return PageResponse.from(service.listNotifications(customerId, cardId, status, page, size));
    }

    @PatchMapping("/notifications/{id}/read")
    public NotificationResponse markRead(@RequestHeader(CUSTOMER_HEADER) String customerId,
                                         @PathVariable UUID id) {
        return NotificationResponse.from(service.markRead(customerId, id));
    }

    @GetMapping("/cards/{cardId}/notification-preferences")
    public PreferencesResponse preferences(@RequestHeader(CUSTOMER_HEADER) String customerId,
                                           @PathVariable UUID cardId) {
        return PreferencesResponse.from(service.getPreferences(customerId, cardId));
    }

    @PutMapping("/cards/{cardId}/notification-preferences")
    public PreferencesResponse updatePreferences(@RequestHeader(CUSTOMER_HEADER) String customerId,
                                                 @PathVariable UUID cardId,
                                                 @Valid @RequestBody UpdatePreferencesRequest request) {
        var updates = request.preferences().stream().map(Dtos.PreferenceDto::toDomain).toList();
        return PreferencesResponse.from(service.updatePreferences(customerId, cardId, updates));
    }
}
