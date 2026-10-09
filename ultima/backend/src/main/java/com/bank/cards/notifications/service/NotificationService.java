package com.bank.cards.notifications.service;

import com.bank.cards.notifications.domain.CardNotification;
import com.bank.cards.notifications.domain.NotificationType;
import com.bank.cards.notifications.domain.PageResult;
import com.bank.cards.notifications.domain.Preference;
import com.bank.cards.notifications.port.CardOwnershipPort;
import com.bank.cards.notifications.port.NotificationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.Clock;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/** Casos de uso del centro de notificaciones. Valida entrada y propiedad de la tarjeta antes de tocar datos. */
@ApplicationScoped
public class NotificationService {

    public static final int MAX_PAGE_SIZE = 50;

    private final NotificationRepository repository;
    private final CardOwnershipPort ownership;
    private final Clock clock;

    @Inject
    public NotificationService(NotificationRepository repository, CardOwnershipPort ownership, Clock clock) {
        this.repository = repository;
        this.ownership = ownership;
        this.clock = clock;
    }

    public PageResult<CardNotification> list(
            String customerId, UUID cardId, boolean unreadOnly, int page, int size) {
        requireOwner(customerId, cardId);
        if (page < 0) {
            throw new DomainException.InvalidRequest("page debe ser mayor o igual a 0.");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new DomainException.InvalidRequest("size debe estar entre 1 y " + MAX_PAGE_SIZE + ".");
        }
        return repository.findByCard(cardId, unreadOnly, page, size);
    }

    public CardNotification markRead(String customerId, UUID notificationId) {
        requireCustomer(customerId);
        CardNotification current = findOwned(customerId, notificationId);
        if (current.isRead()) {
            return current;
        }
        repository.markRead(notificationId, clock.instant());
        return findOwned(customerId, notificationId);
    }

    public List<Preference> getPreferences(String customerId, UUID cardId) {
        requireOwner(customerId, cardId);
        return withDefaults(repository.findPreferences(cardId));
    }

    public List<Preference> updatePreferences(String customerId, UUID cardId, List<Preference> requested) {
        requireOwner(customerId, cardId);
        validatePreferences(requested);
        repository.savePreferences(cardId, requested);
        return withDefaults(repository.findPreferences(cardId));
    }

    private CardNotification findOwned(String customerId, UUID notificationId) {
        if (notificationId == null) {
            throw new DomainException.InvalidRequest("Falta el identificador de la notificación.");
        }
        return repository.findById(notificationId)
                .filter(n -> ownership.isOwner(customerId, n.cardId()))
                .orElseThrow(() -> new DomainException.NotFound(notificationId));
    }

    private void validatePreferences(List<Preference> requested) {
        if (requested == null || requested.isEmpty()) {
            throw new DomainException.InvalidRequest("Debes enviar al menos una preferencia.");
        }
        Set<NotificationType> seen = EnumSet.noneOf(NotificationType.class);
        for (Preference preference : requested) {
            if (preference == null || preference.type() == null) {
                throw new DomainException.InvalidRequest("Cada preferencia requiere un tipo válido.");
            }
            if (!seen.add(preference.type())) {
                throw new DomainException.InvalidRequest("Tipo duplicado: " + preference.type() + ".");
            }
        }
    }

    /** Los tipos sin fila guardada se consideran activados. */
    private static List<Preference> withDefaults(List<Preference> stored) {
        Map<NotificationType, Boolean> byType = new EnumMap<>(NotificationType.class);
        stored.forEach(p -> byType.put(p.type(), p.enabled()));
        return Arrays.stream(NotificationType.values())
                .map(type -> new Preference(type, byType.getOrDefault(type, true)))
                .toList();
    }

    private void requireCustomer(String customerId) {
        if (customerId == null || customerId.isBlank()) {
            throw new DomainException.Unauthenticated();
        }
    }

    private void requireOwner(String customerId, UUID cardId) {
        requireCustomer(customerId);
        if (cardId == null) {
            throw new DomainException.InvalidRequest("Falta el identificador de la tarjeta.");
        }
        if (!ownership.isOwner(customerId, cardId)) {
            throw new DomainException.AccessDenied();
        }
    }
}
