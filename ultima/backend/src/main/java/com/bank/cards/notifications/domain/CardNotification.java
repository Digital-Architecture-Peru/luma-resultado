package com.bank.cards.notifications.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Notificación de una tarjeta. Solo expone los últimos 4 dígitos; el PAN nunca se almacena.
 * {@code amount} y {@code readAt} pueden ser nulos.
 */
public record CardNotification(
        UUID id,
        UUID cardId,
        String cardLast4,
        NotificationType type,
        String title,
        String message,
        BigDecimal amount,
        Instant readAt,
        Instant createdAt) {

    public boolean isRead() {
        return readAt != null;
    }

    public CardNotification withReadAt(Instant instant) {
        return new CardNotification(id, cardId, cardLast4, type, title, message, amount, instant, createdAt);
    }
}
