package com.example.cuentas.notificaciones.api.dto;

import com.example.cuentas.notificaciones.domain.AccountMask;
import com.example.cuentas.notificaciones.domain.Notification;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String account,
        String type,
        String message,
        BigDecimal amount,
        boolean read,
        Instant createdAt) {

    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(n.id(), AccountMask.mask(n.accountId()), n.type().name(),
                n.message(), n.amount(), n.isRead(), n.createdAt());
    }
}
