package com.example.banca.notification.adapters.in.web;

import com.example.banca.notification.adapters.in.web.Dtos.NotificationDto;
import com.example.banca.notification.adapters.in.web.Dtos.PageDto;
import com.example.banca.notification.application.NotificationService;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** X-Customer-Id es un sustituto ficticio de autenticación (fuera de alcance; no apto para producción). */
@RestController
@RequestMapping("/api/v1/payment-notifications")
public class NotificationController {

    static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public PageDto<NotificationDto> list(@RequestHeader(CUSTOMER_HEADER) String customerId,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "20") int size) {
        return NotificationMapper.toPageDto(service.list(customerId, page, size));
    }

    @PatchMapping("/{id}/read")
    public NotificationDto markRead(@RequestHeader(CUSTOMER_HEADER) String customerId,
                                    @PathVariable UUID id) {
        return NotificationMapper.toDto(service.markRead(id, customerId));
    }
}
