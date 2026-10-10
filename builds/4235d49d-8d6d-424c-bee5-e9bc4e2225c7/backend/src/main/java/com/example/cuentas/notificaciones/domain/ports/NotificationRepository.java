package com.example.cuentas.notificaciones.domain.ports;

import com.example.cuentas.notificaciones.domain.Notification;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationRepository {

    List<Notification> findByAccount(String accountId, boolean unreadOnly, int page, int size);

    Optional<Notification> findById(UUID id);

    void save(Notification notification);

    void markRead(UUID id, Instant readAt);
}
