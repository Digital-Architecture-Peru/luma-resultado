package com.example.cuentas.notificaciones.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record Notification(
        UUID id,
        String accountId,
        NotificationType type,
        String message,
        BigDecimal amount,
        Instant readAt,
        Instant createdAt) {

    public boolean isRead() {
        return readAt != null;
    }

    public Notification markRead(Instant when) {
        return new Notification(id, accountId, type, message, amount, when, createdAt);
    }
}
