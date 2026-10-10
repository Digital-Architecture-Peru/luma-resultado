package com.example.banking.notifications.domain;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record Notification(
        UUID id,
        String accountId,
        NotificationType type,
        String title,
        String message,
        NotificationStatus status,
        Instant createdAt,
        Instant readAt) {

    public Notification {
        Objects.requireNonNull(id, "id");
        Objects.requireNonNull(type, "type");
        Objects.requireNonNull(status, "status");
        Objects.requireNonNull(createdAt, "createdAt");
        if (accountId == null || accountId.isBlank()) {
            throw new DomainException.InvalidRequest("accountId es obligatorio");
        }
        if (title == null || title.isBlank()) {
            throw new DomainException.InvalidRequest("title es obligatorio");
        }
        if (message == null || message.isBlank()) {
            throw new DomainException.InvalidRequest("message es obligatorio");
        }
    }

    public static Notification unread(String accountId, NotificationType type, String title,
                                      String message, Instant now) {
        return new Notification(UUID.randomUUID(), accountId, type, title, message,
                NotificationStatus.UNREAD, now, null);
    }

    /** Idempotente: si ya estaba leída conserva la fecha original. */
    public Notification markRead(Instant now) {
        if (status == NotificationStatus.READ) {
            return this;
        }
        return new Notification(id, accountId, type, title, message, NotificationStatus.READ, createdAt, now);
    }
}
