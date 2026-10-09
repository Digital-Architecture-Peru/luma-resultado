package com.banco.notifications.application;

import com.banco.notifications.domain.Card;
import com.banco.notifications.domain.CardRepository;
import com.banco.notifications.domain.Channel;
import com.banco.notifications.domain.Notification;
import com.banco.notifications.domain.NotificationPreference;
import com.banco.notifications.domain.NotificationPublisher;
import com.banco.notifications.domain.NotificationRepository;
import com.banco.notifications.domain.NotificationStatus;
import com.banco.notifications.domain.NotificationType;
import com.banco.notifications.domain.PagedResult;
import com.banco.notifications.domain.PreferenceRepository;
import com.banco.notifications.domain.ResourceNotFoundException;
import java.time.Clock;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    static final int MAX_PAGE_SIZE = 100;

    private final CardRepository cards;
    private final NotificationRepository notifications;
    private final PreferenceRepository preferences;
    private final NotificationPublisher publisher;
    private final Clock clock;

    public NotificationService(CardRepository cards,
                               NotificationRepository notifications,
                               PreferenceRepository preferences,
                               NotificationPublisher publisher,
                               Clock clock) {
        this.cards = cards;
        this.notifications = notifications;
        this.preferences = preferences;
        this.publisher = publisher;
        this.clock = clock;
    }

    public List<Card> listCards(String customerId) {
        requireCustomer(customerId);
        return cards.findByCustomer(customerId);
    }

    public PagedResult<Notification> listNotifications(String customerId, UUID cardId,
                                                       NotificationStatus status, int page, int size) {
        requireCustomer(customerId);
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("page debe ser >= 0 y size entre 1 y " + MAX_PAGE_SIZE);
        }
        requireOwnedCard(customerId, cardId);
        return notifications.findByCard(cardId, status, page, size);
    }

    @Transactional
    public Notification markRead(String customerId, UUID notificationId) {
        requireCustomer(customerId);
        Notification current = notifications.findByIdForCustomer(notificationId, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada"));
        if (current.isRead()) {
            return current;
        }
        Notification updated = current.markRead(clock.instant());
        notifications.save(updated);
        publisher.publishRead(updated);
        return updated;
    }

    public List<NotificationPreference> getPreferences(String customerId, UUID cardId) {
        requireCustomer(customerId);
        requireOwnedCard(customerId, cardId);
        return completeMatrix(preferences.findByCard(cardId));
    }

    @Transactional
    public List<NotificationPreference> updatePreferences(String customerId, UUID cardId,
                                                          List<NotificationPreference> updates) {
        requireCustomer(customerId);
        requireOwnedCard(customerId, cardId);
        preferences.saveAll(cardId, updates);
        return completeMatrix(preferences.findByCard(cardId));
    }

    /** Devuelve todas las combinaciones tipo × canal; las no guardadas quedan deshabilitadas. */
    private static List<NotificationPreference> completeMatrix(List<NotificationPreference> stored) {
        Map<String, Boolean> enabledByKey = new HashMap<>();
        for (NotificationPreference p : stored) {
            enabledByKey.put(key(p.type(), p.channel()), p.enabled());
        }
        List<NotificationPreference> result = new ArrayList<>();
        for (NotificationType type : NotificationType.values()) {
            for (Channel channel : Channel.values()) {
                result.add(new NotificationPreference(type, channel,
                        enabledByKey.getOrDefault(key(type, channel), false)));
            }
        }
        return result;
    }

    private static String key(NotificationType type, Channel channel) {
        return type.name() + ":" + channel.name();
    }

    private void requireOwnedCard(String customerId, UUID cardId) {
        if (!cards.existsForCustomer(cardId, customerId)) {
            throw new ResourceNotFoundException("Tarjeta no encontrada");
        }
    }

    private static void requireCustomer(String customerId) {
        if (customerId == null || customerId.isBlank()) {
            throw new IllegalArgumentException("X-Customer-Id es obligatorio");
        }
    }
}
