package com.banco.notifications.domain;

import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia de notificaciones. */
public interface NotificationRepository {

    /** @param status filtro opcional (null = todas) */
    PagedResult<Notification> findByCard(UUID cardId, NotificationStatus status, int page, int size);

    Optional<Notification> findByIdForCustomer(UUID id, String customerId);

    void save(Notification notification);
}
