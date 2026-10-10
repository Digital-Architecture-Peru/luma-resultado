package com.example.notifications.port;

import com.example.notifications.domain.Notification;
import com.example.notifications.domain.NotificationStatus;
import com.example.notifications.domain.NotificationType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository {

    Notification save(Notification notification);

    Optional<Notification> findByReferenceAndType(String paymentReference, NotificationType type);

    Optional<Notification> findByIdAndCustomer(long id, String customerId);

    /** Lista las notificaciones del cliente; {@code status} nulo significa sin filtro. */
    List<Notification> findByCustomer(String customerId, NotificationStatus status);

    void markRead(long id, String customerId, Instant readAt);
}
