package com.example.notifications.adapter;

import com.example.notifications.application.NotificationService;
import com.example.notifications.domain.Notification;
import com.example.notifications.domain.NotificationStatus;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * El header X-Customer-Id simula la identidad (autenticación real pendiente).
 * El POST solo debe exponerse en entornos de prueba.
 */
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Notification> list(@RequestHeader(CUSTOMER_HEADER) String customerId,
                                   @RequestParam(required = false) NotificationStatus status) {
        return service.list(customerId, status);
    }

    @PatchMapping("/{id}/read")
    public Notification markAsRead(@RequestHeader(CUSTOMER_HEADER) String customerId, @PathVariable long id) {
        return service.markAsRead(id, customerId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification create(@RequestHeader(CUSTOMER_HEADER) String customerId,
                               @Valid @RequestBody CreateNotificationRequest body) {
        return service.create(customerId, body.paymentReference(), body.type(), body.amount(),
                body.currency(), body.account());
    }
}
