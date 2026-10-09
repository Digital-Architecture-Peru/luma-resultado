package com.banca.tarjetas.notifications.application.port;

import com.banca.tarjetas.notifications.application.PageResult;
import com.banca.tarjetas.notifications.domain.Notification;
import com.banca.tarjetas.notifications.domain.NotificationStatus;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia. */
public interface NotificationRepository {

    PageResult<Notification> findByCard(String customerRef, String cardRef,
                                        Optional<NotificationStatus> status, int page, int size);

    long countUnread(String customerRef);

    /** @return true si la notificación existía, pertenece al cliente y quedó leída. */
    boolean markAsRead(String customerRef, UUID id, Instant readAt);

    void save(Notification notification);
}
