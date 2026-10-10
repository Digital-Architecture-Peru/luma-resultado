package com.banca.notificaciones.notification.repository;

import com.banca.notificaciones.notification.domain.NotificationPreference;
import com.banca.notificaciones.notification.domain.NotificationType;
import java.util.List;
import java.util.Optional;

/** Puerto de persistencia de preferencias. */
public interface PreferenceRepository {

    List<NotificationPreference> findByAccount(String accountId);

    Optional<NotificationPreference> find(String accountId, NotificationType type);

    void save(NotificationPreference preference);
}
