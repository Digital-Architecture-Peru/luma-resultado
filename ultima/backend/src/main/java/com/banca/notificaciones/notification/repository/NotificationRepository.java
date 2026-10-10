package com.banca.notificaciones.notification.repository;

import com.banca.notificaciones.notification.domain.Notification;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia de notificaciones. */
public interface NotificationRepository {

    List<Notification> findByAccount(String accountId, boolean unreadOnly, int page, int size);

    long countByAccount(String accountId, boolean unreadOnly);

    Optional<Notification> findById(UUID id);

    void save(Notification notification);
}
