package com.banco.notificaciones.port;

import com.banco.notificaciones.domain.Notification;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Puerto de persistencia. Toda operación está acotada al cliente (evita IDOR). */
public interface NotificationRepository {

    List<Notification> findByCustomer(String customerId, boolean unreadOnly, int limit);

    long countUnread(String customerId);

    /** @return true si la notificación existe y pertenece al cliente (idempotente si ya estaba leída). */
    boolean markRead(String customerId, UUID id, Instant readAt);

    /** @return false si ya existía una notificación para (paymentId, type). */
    boolean insertIfAbsent(Notification notification);
}
