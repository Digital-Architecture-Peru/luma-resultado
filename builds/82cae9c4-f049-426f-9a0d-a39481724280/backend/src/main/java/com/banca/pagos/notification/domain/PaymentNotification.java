package com.banca.pagos.notification.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Notificación inmutable de un evento de pago. */
public record PaymentNotification(
        UUID id,
        String customerId,
        String paymentReference,
        NotificationType type,
        NotificationStatus status,
        String title,
        String message,
        BigDecimal amount,
        String currency,
        Instant createdAt,
        Instant readAt) {

    public PaymentNotification markRead(Instant now) {
        if (status == NotificationStatus.READ) {
            return this;
        }
        return new PaymentNotification(id, customerId, paymentReference, type, NotificationStatus.READ,
                title, message, amount, currency, createdAt, now);
    }
}
