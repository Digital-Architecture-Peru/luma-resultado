package com.banco.notificaciones.service;

import com.banco.notificaciones.domain.Notification;
import com.banco.notificaciones.port.NotificationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Clock;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class NotificationService {

    static final int MAX_LIMIT = 100;

    private final NotificationRepository repository;
    private final Clock clock;

    public NotificationService(NotificationRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    public List<Notification> list(String customerId, String status, int limit) {
        requireCustomer(customerId);
        boolean unreadOnly = parseUnreadOnly(status);
        int safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
        return repository.findByCustomer(customerId, unreadOnly, safeLimit);
    }

    public long unreadCount(String customerId) {
        requireCustomer(customerId);
        return repository.countUnread(customerId);
    }

    public void markRead(String customerId, UUID id) {
        requireCustomer(customerId);
        if (!repository.markRead(customerId, id, clock.instant())) {
            throw new NotificationNotFoundException("Notificación no encontrada");
        }
    }

    public Notification create(String customerId, NewNotification input) {
        requireCustomer(customerId);
        Notification notification = new Notification(
                UUID.randomUUID(), customerId, input.paymentId(), input.type(),
                input.title(), input.message(), input.amount(), input.currency(),
                input.accountLast4(), clock.instant(), null);
        if (!repository.insertIfAbsent(notification)) {
            throw new DuplicateNotificationException("Ya existe una notificación para ese pago y tipo");
        }
        return notification;
    }

    private static boolean parseUnreadOnly(String status) {
        if ("unread".equals(status)) {
            return true;
        }
        if ("all".equals(status)) {
            return false;
        }
        throw new IllegalArgumentException("status debe ser 'unread' o 'all'");
    }

    private static void requireCustomer(String customerId) {
        if (customerId == null || customerId.isBlank() || customerId.length() > 36) {
            throw new IllegalArgumentException("Cabecera X-Customer-Id inválida");
        }
    }
}
