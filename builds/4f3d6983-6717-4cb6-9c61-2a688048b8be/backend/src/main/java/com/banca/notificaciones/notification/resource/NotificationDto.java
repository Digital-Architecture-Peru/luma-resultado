package com.banca.notificaciones.notification.resource;

import com.banca.notificaciones.notification.domain.Notification;
import com.banca.notificaciones.notification.domain.NotificationType;
import java.math.BigDecimal;
import java.time.Instant;

public record NotificationDto(String id, String accountId, NotificationType type, String title, String body,
                              BigDecimal amount, String currency, Instant createdAt, Instant readAt) {

    public static NotificationDto from(Notification n) {
        return new NotificationDto(n.getId().toString(), n.getAccountId(), n.getType(), n.getTitle(),
                n.getBody(), n.getAmount(), n.getCurrency(), n.getCreatedAt(), n.getReadAt());
    }
}
