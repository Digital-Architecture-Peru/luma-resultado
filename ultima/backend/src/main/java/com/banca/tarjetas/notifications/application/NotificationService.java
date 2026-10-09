package com.banca.tarjetas.notifications.application;

import com.banca.tarjetas.notifications.application.port.NotificationDispatcher;
import com.banca.tarjetas.notifications.application.port.NotificationRepository;
import com.banca.tarjetas.notifications.domain.Notification;
import com.banca.tarjetas.notifications.domain.NotificationStatus;
import com.banca.tarjetas.notifications.domain.NotificationType;
import java.time.Clock;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    static final int MAX_PAGE_SIZE = 50;

    private final NotificationRepository repository;
    private final NotificationDispatcher dispatcher;
    private final Clock clock;

    public NotificationService(NotificationRepository repository,
                               NotificationDispatcher dispatcher,
                               Clock clock) {
        this.repository = repository;
        this.dispatcher = dispatcher;
        this.clock = clock;
    }

    public PageResult<Notification> listByCard(String customerRef, String cardRef,
                                               Optional<NotificationStatus> status,
                                               int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("page debe ser >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("size debe estar entre 1 y " + MAX_PAGE_SIZE);
        }
        return repository.findByCard(customerRef, cardRef, status, page, size);
    }

    public long unreadCount(String customerRef) {
        return repository.countUnread(customerRef);
    }

    public void markAsRead(String customerRef, UUID id) {
        boolean updated = repository.markAsRead(customerRef, id, clock.instant());
        if (!updated) {
            throw new NotificationNotFoundException(id);
        }
    }

    /** Registra una notificación nueva y la entrega por el canal configurado. */
    public Notification register(String customerRef, String cardRef, String last4,
                                 NotificationType type, String title, String message) {
        Notification notification = Notification.create(UUID.randomUUID(), customerRef, cardRef,
                last4, type, title, message, clock.instant());
        repository.save(notification);
        dispatcher.dispatch(notification);
        return notification;
    }
}
