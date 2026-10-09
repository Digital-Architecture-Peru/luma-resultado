package com.bank.cards.notifications.port;

import com.bank.cards.notifications.domain.CardNotification;
import com.bank.cards.notifications.domain.PageResult;
import com.bank.cards.notifications.domain.Preference;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia de notificaciones y preferencias. */
public interface NotificationRepository {

    /** Notificaciones de una tarjeta, más recientes primero. */
    PageResult<CardNotification> findByCard(UUID cardId, boolean unreadOnly, int page, int size);

    Optional<CardNotification> findById(UUID id);

    /** Marca como leída solo si aún no lo estaba (idempotente). */
    void markRead(UUID id, Instant readAt);

    /** Preferencias guardadas; puede devolver menos tipos de los existentes. */
    List<Preference> findPreferences(UUID cardId);

    /** Guarda (upsert) las preferencias recibidas en una sola transacción. */
    void savePreferences(UUID cardId, List<Preference> preferences);
}
