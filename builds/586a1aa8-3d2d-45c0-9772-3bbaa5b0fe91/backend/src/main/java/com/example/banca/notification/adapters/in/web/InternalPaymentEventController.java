package com.example.banca.notification.adapters.in.web;

import com.example.banca.notification.adapters.in.web.Dtos.PaymentEventRequest;
import com.example.banca.notification.application.NotificationService;
import com.example.banca.notification.domain.PaymentEvent;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Simula la llegada de eventos de pago (no hay broker definido). Solo uso interno. */
@RestController
@RequestMapping("/internal/payment-events")
public class InternalPaymentEventController {

    private final NotificationService service;

    public InternalPaymentEventController(NotificationService service) {
        this.service = service;
    }

    /** 201 si se creó la notificación; 204 si fue duplicado o los canales están deshabilitados. */
    @PostMapping
    public ResponseEntity<Dtos.NotificationDto> receive(@Valid @RequestBody PaymentEventRequest request) {
        PaymentEvent event = new PaymentEvent(request.customerId(), request.paymentId(),
                request.eventType(), request.amount(), request.currency(), request.accountNumber());
        return service.registerEvent(event)
                .map(n -> ResponseEntity.status(HttpStatus.CREATED).body(NotificationMapper.toDto(n)))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }
}
