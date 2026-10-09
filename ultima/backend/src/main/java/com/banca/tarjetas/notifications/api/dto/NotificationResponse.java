package com.banca.tarjetas.notifications.api.dto;

import com.banca.tarjetas.notifications.domain.Notification;
import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String cardRef,
        String last4,
        String type,
        String title,
        String message,
        String status,
        Instant createdAt,
        Instant readAt) {

    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(n.id(), n.cardRef(), n.last4(), n.type().name(),
                n.title(), n.message(), n.status().name(), n.createdAt(), n.readAt());
    }
}
