package com.banco.notificaciones.api;

import com.banco.notificaciones.domain.Notification;
import com.banco.notificaciones.domain.NotificationType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record NotificationDto(
        UUID id,
        String paymentId,
        NotificationType type,
        String title,
        String message,
        BigDecimal amount,
        String currency,
        String accountLast4,
        Instant createdAt,
        Instant readAt) {

    public static NotificationDto from(Notification n) {
        return new NotificationDto(n.id(), n.paymentId(), n.type(), n.title(), n.message(),
                n.amount(), n.currency(), n.accountLast4(), n.createdAt(), n.readAt());
    }
}
