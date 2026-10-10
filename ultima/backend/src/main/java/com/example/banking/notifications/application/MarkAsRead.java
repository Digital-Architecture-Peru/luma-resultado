package com.example.banking.notifications.application;

import com.example.banking.notifications.application.ports.AccountOwnership;
import com.example.banking.notifications.application.ports.NotificationRepository;
import com.example.banking.notifications.domain.DomainException;
import com.example.banking.notifications.domain.Notification;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.Clock;
import java.util.UUID;

@ApplicationScoped
public class MarkAsRead {

    private final NotificationRepository repository;
    private final OwnershipGuard guard;
    private final Clock clock;

    /** Constructor de producción: ArC lo usa por estar anotado con {@code @Inject}. */
    @Inject
    public MarkAsRead(NotificationRepository repository, AccountOwnership ownership) {
        this(repository, ownership, Clock.systemUTC());
    }

    /** Constructor para pruebas con reloj fijo (no es candidato de inyección). */
    MarkAsRead(NotificationRepository repository, AccountOwnership ownership, Clock clock) {
        this.repository = repository;
        this.guard = new OwnershipGuard(ownership);
        this.clock = clock;
    }

    public Notification execute(String customerId, UUID notificationId) {
        Notification notification = repository.findById(notificationId)
                .orElseThrow(() -> new DomainException.NotFound("Notificación no encontrada"));
        guard.require(customerId, notification.accountId());
        Notification updated = notification.markRead(clock.instant());
        if (updated != notification) {
            repository.save(updated);
        }
        return updated;
    }
}
