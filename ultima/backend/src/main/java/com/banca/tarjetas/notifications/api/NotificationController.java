package com.banca.tarjetas.notifications.api;

import com.banca.tarjetas.notifications.api.dto.NotificationResponse;
import com.banca.tarjetas.notifications.api.dto.UnreadCountResponse;
import com.banca.tarjetas.notifications.application.NotificationService;
import com.banca.tarjetas.notifications.application.PageResult;
import com.banca.tarjetas.notifications.domain.NotificationStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * El cliente llega en la cabecera X-Customer-Ref (hipótesis: la autenticación real la
 * resuelve la plataforma de Banca por Internet).
 */
@RestController
@RequestMapping("/api/v1")
public class NotificationController {

    static final String CUSTOMER_HEADER = "X-Customer-Ref";

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping("/cards/{cardRef}/notifications")
    public PageResult<NotificationResponse> list(
            @RequestHeader(CUSTOMER_HEADER) String customerRef,
            @PathVariable String cardRef,
            @RequestParam(required = false) NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service
                .listByCard(customerRef, cardRef, Optional.ofNullable(status), page, size)
                .map(NotificationResponse::from);
    }

    @GetMapping("/notifications/unread-count")
    public UnreadCountResponse unreadCount(@RequestHeader(CUSTOMER_HEADER) String customerRef) {
        return new UnreadCountResponse(service.unreadCount(customerRef));
    }

    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<Void> markAsRead(@RequestHeader(CUSTOMER_HEADER) String customerRef,
                                           @PathVariable UUID id) {
        service.markAsRead(customerRef, id);
        return ResponseEntity.noContent().build();
    }
}
