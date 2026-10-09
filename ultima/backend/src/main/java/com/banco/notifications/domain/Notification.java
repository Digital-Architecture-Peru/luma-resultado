package com.banco.notifications.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record Notification(
        UUID id,
        UUID cardId,
        NotificationType type,
        String title,
        String message,
        BigDecimal amount,
        String currency,
        NotificationStatus status,
        Instant createdAt,
        Instant readAt) {

    public boolean isRead() {
        return status == NotificationStatus.READ;
    }

    public Notification markRead(Instant now) {
        if (isRead()) {
            return this;
        }
        return new Notification(id, cardId, type, title, message, amount, currency,
                NotificationStatus.READ, createdAt, now);
    }
}
