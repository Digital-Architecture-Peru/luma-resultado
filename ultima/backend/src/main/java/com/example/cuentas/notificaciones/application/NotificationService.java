package com.example.cuentas.notificaciones.application;

import com.example.cuentas.notificaciones.domain.Notification;
import com.example.cuentas.notificaciones.domain.NotificationType;
import com.example.cuentas.notificaciones.domain.Preference;
import com.example.cuentas.notificaciones.domain.ports.NotificationDispatcher;
import com.example.cuentas.notificaciones.domain.ports.NotificationRepository;
import com.example.cuentas.notificaciones.domain.ports.PreferenceRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    static final int MAX_PAGE_SIZE = 100;

    private final NotificationRepository notifications;
    private final PreferenceRepository preferences;
    private final NotificationDispatcher dispatcher;
    private final Clock clock;

    public NotificationService(NotificationRepository notifications,
                               PreferenceRepository preferences,
                               NotificationDispatcher dispatcher,
                               Clock clock) {
        this.notifications = notifications;
        this.preferences = preferences;
        this.dispatcher = dispatcher;
        this.clock = clock;
    }

    public List<Notification> list(String accountId, boolean unreadOnly, int page, int size) {
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("Paginación inválida: page >= 0 y 1 <= size <= " + MAX_PAGE_SIZE);
        }
        return notifications.findByAccount(accountId, unreadOnly, page, size);
    }

    /**
     * Marca como leída. Punto de extensión: aquí debe validarse que la notificación
     * pertenece a la cuenta del cliente autenticado (auth la provee la banca existente).
     */
    public Notification markRead(UUID id) {
        Notification current = notifications.findById(id)
                .orElseThrow(() -> new NotFoundException("Notificación no encontrada"));
        if (current.isRead()) {
            return current;
        }
        Instant now = clock.instant();
        notifications.markRead(id, now);
        return current.markRead(now);
    }

    /** Registra un evento de cuenta si las preferencias del cliente lo permiten. */
    public Optional<Notification> register(String accountId, NotificationType type,
                                           String message, BigDecimal amount) {
        Instant now = clock.instant();
        Preference preference = preferences.find(accountId)
                .orElseGet(() -> Preference.defaults(accountId, now));
        if (!preference.allows(type, amount)) {
            return Optional.empty();
        }
        Notification created = new Notification(UUID.randomUUID(), accountId, type, message, amount, null, now);
        notifications.save(created);
        dispatcher.dispatch(created);
        return Optional.of(created);
    }
}
