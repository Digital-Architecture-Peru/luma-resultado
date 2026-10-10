package com.banca.notificaciones.notification.service;

import com.banca.notificaciones.notification.channel.NotificationChannel;
import com.banca.notificaciones.notification.domain.DomainException;
import com.banca.notificaciones.notification.domain.Notification;
import com.banca.notificaciones.notification.domain.NotificationPreference;
import com.banca.notificaciones.notification.domain.NotificationType;
import com.banca.notificaciones.notification.domain.Page;
import com.banca.notificaciones.notification.domain.PreferenceUpdate;
import com.banca.notificaciones.notification.repository.AccountRepository;
import com.banca.notificaciones.notification.repository.NotificationRepository;
import com.banca.notificaciones.notification.repository.PreferenceRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.Clock;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Casos de uso de notificaciones de cuenta.
 * Punto de extensión (fuera de alcance, ver README): verificar que la cuenta pertenece
 * al cliente autenticado antes de cualquier operación (riesgo IDOR).
 */
@ApplicationScoped
public class NotificationService {

    static final int MAX_PAGE_SIZE = 100;

    private final NotificationRepository notifications;
    private final PreferenceRepository preferences;
    private final AccountRepository accounts;
    private final NotificationChannel channel;
    private final Clock clock;

    @Inject
    public NotificationService(NotificationRepository notifications, PreferenceRepository preferences,
                               AccountRepository accounts, NotificationChannel channel, Clock clock) {
        this.notifications = notifications;
        this.preferences = preferences;
        this.accounts = accounts;
        this.channel = channel;
        this.clock = clock;
    }

    @Transactional
    public Page<Notification> list(String accountId, boolean unreadOnly, int page, int size) {
        requireAccount(accountId);
        if (page < 0) {
            throw DomainException.badRequest("page debe ser mayor o igual a 0.");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw DomainException.badRequest("size debe estar entre 1 y " + MAX_PAGE_SIZE + ".");
        }
        List<Notification> items = notifications.findByAccount(accountId, unreadOnly, page, size);
        return new Page<>(items, page, size, notifications.countByAccount(accountId, unreadOnly));
    }

    @Transactional
    public Notification markRead(String rawId) {
        Notification notification = notifications.findById(parseId(rawId))
                .orElseThrow(() -> DomainException.notFound("Notificación no encontrada."));
        notification.markRead(clock.instant());
        notifications.save(notification);
        return notification;
    }

    @Transactional
    public List<NotificationPreference> getPreferences(String accountId) {
        requireAccount(accountId);
        List<NotificationPreference> stored = preferences.findByAccount(accountId);
        return Arrays.stream(NotificationType.values())
                .map(type -> stored.stream()
                        .filter(p -> p.getType() == type)
                        .findFirst()
                        .orElseGet(() -> NotificationPreference.defaults(accountId, type)))
                .toList();
    }

    @Transactional
    public List<NotificationPreference> updatePreferences(String accountId, List<PreferenceUpdate> updates) {
        requireAccount(accountId);
        if (updates == null || updates.isEmpty()) {
            throw DomainException.badRequest("Se requiere al menos una preferencia.");
        }
        updates.forEach(NotificationService::validate);
        for (PreferenceUpdate update : updates) {
            NotificationPreference preference = preferences.find(accountId, update.type())
                    .orElseGet(() -> NotificationPreference.defaults(accountId, update.type()));
            preference.update(update.enabled(), update.threshold());
            preferences.save(preference);
        }
        return getPreferences(accountId);
    }

    /** Genera una notificación si el cliente no la desactivó; la entrega la decide el canal. */
    @Transactional
    public Optional<Notification> notify(String accountId, NotificationType type, String title, String body,
                                         BigDecimal amount, String currency) {
        requireAccount(accountId);
        boolean enabled = preferences.find(accountId, type)
                .map(NotificationPreference::isEnabled)
                .orElse(true);
        if (!enabled) {
            return Optional.empty();
        }
        Notification notification = Notification.create(UUID.randomUUID(), accountId, type, title, body,
                amount, currency, clock.instant());
        channel.deliver(notification);
        return Optional.of(notification);
    }

    private void requireAccount(String accountId) {
        if (accountId == null || accountId.isBlank() || !accounts.exists(accountId)) {
            throw DomainException.notFound("Cuenta no encontrada.");
        }
    }

    private static UUID parseId(String rawId) {
        try {
            return UUID.fromString(rawId);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw DomainException.badRequest("Identificador de notificación inválido.");
        }
    }

    private static void validate(PreferenceUpdate update) {
        if (update == null || update.type() == null) {
            throw DomainException.badRequest("Cada preferencia requiere un type válido.");
        }
        BigDecimal threshold = update.threshold();
        if (threshold != null && threshold.signum() < 0) {
            throw DomainException.badRequest("threshold no puede ser negativo.");
        }
        if (update.type() == NotificationType.LOW_BALANCE && update.enabled() && threshold == null) {
            throw DomainException.badRequest("LOW_BALANCE habilitado requiere threshold.");
        }
    }
}
