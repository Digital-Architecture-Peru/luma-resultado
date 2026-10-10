package com.banco.notificaciones.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Notificación inmutable de un evento de pago. Solo guarda los últimos 4 dígitos de la cuenta. */
public record Notification(
        UUID id,
        String customerId,
        String paymentId,
        NotificationType type,
        String title,
        String message,
        BigDecimal amount,
        String currency,
        String accountLast4,
        Instant createdAt,
        Instant readAt) {

    public boolean isRead() {
        return readAt != null;
    }
}
