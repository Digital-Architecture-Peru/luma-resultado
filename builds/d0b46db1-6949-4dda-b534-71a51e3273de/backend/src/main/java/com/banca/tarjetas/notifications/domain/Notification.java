package com.banca.tarjetas.notifications.domain;

import java.time.Instant;
import java.util.UUID;

/**
 * Notificación de una tarjeta. Solo guarda el token de tarjeta y los últimos 4 dígitos,
 * nunca el número completo.
 */
public record Notification(
        UUID id,
        String customerRef,
        String cardRef,
        String last4,
        NotificationType type,
        String title,
        String message,
        NotificationStatus status,
        Instant createdAt,
        Instant readAt) {

    public static Notification create(UUID id, String customerRef, String cardRef, String last4,
                                      NotificationType type, String title, String message,
                                      Instant now) {
        if (last4 == null || !last4.matches("\\d{4}")) {
            throw new IllegalArgumentException("last4 debe tener exactamente 4 dígitos");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("title es obligatorio");
        }
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("message es obligatorio");
        }
        return new Notification(id, customerRef, cardRef, last4, type, title, message,
                NotificationStatus.UNREAD, now, null);
    }

    public boolean isUnread() {
        return status == NotificationStatus.UNREAD;
    }
}
