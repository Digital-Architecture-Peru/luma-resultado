package com.banco.notifications.domain;

import java.util.List;
import java.util.UUID;

/** Puerto de persistencia de preferencias de notificación por tarjeta. */
public interface PreferenceRepository {

    List<NotificationPreference> findByCard(UUID cardId);

    void saveAll(UUID cardId, List<NotificationPreference> preferences);
}
