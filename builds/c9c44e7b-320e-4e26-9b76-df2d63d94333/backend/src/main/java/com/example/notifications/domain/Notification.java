package com.example.notifications.domain;

import java.math.BigDecimal;
import java.time.Instant;

public record Notification(
        Long id,
        String customerId,
        String paymentReference,
        NotificationType type,
        BigDecimal amount,
        String currency,
        String maskedAccount,
        NotificationStatus status,
        Instant createdAt,
        Instant readAt) {

    public Notification withId(Long newId) {
        return new Notification(newId, customerId, paymentReference, type, amount, currency,
                maskedAccount, status, createdAt, readAt);
    }

    public Notification markedRead(Instant when) {
        return new Notification(id, customerId, paymentReference, type, amount, currency,
                maskedAccount, NotificationStatus.READ, createdAt, when);
    }

    public boolean isRead() {
        return status == NotificationStatus.READ;
    }
}
