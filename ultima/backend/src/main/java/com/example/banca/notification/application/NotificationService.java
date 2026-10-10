package com.example.banca.notification.application;

import com.example.banca.notification.domain.Channel;
import com.example.banca.notification.domain.NotificationRepository;
import com.example.banca.notification.domain.NotificationSender;
import com.example.banca.notification.domain.PageResult;
import com.example.banca.notification.domain.PaymentEvent;
import com.example.banca.notification.domain.PaymentNotification;
import java.time.Clock;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    static final int MAX_PAGE_SIZE = 100;

    private final NotificationRepository notifications;
    private final PreferenceService preferences;
    private final NotificationSender sender;
    private final Clock clock;

    public NotificationService(NotificationRepository notifications, PreferenceService preferences,
                               NotificationSender sender, Clock clock) {
        this.notifications = notifications;
        this.preferences = preferences;
        this.sender = sender;
        this.clock = clock;
    }

    /**
     * Registra un evento de pago. Devuelve la notificación in-app creada, o vacío si el evento
     * ya fue procesado (idempotencia por pago+tipo) o la bandeja está deshabilitada.
     */
    @Transactional
    public Optional<PaymentNotification> registerEvent(PaymentEvent event) {
        if (notifications.exists(event.paymentId(), event.eventType())) {
            return Optional.empty();
        }
        Set<Channel> enabled = preferences.enabledChannels(event.customerId(), event.eventType());
        if (enabled.isEmpty()) {
            return Optional.empty();
        }
        PaymentNotification notification =
                PaymentNotification.newUnread(UUID.randomUUID(), event, clock.instant());
        Optional<PaymentNotification> stored = Optional.empty();
        if (enabled.contains(Channel.IN_APP)) {
            stored = Optional.of(notifications.save(notification));
        }
        enabled.stream()
                .filter(channel -> channel != Channel.IN_APP)
                .forEach(channel -> sender.send(channel, notification));
        return stored;
    }

    @Transactional(readOnly = true)
    public PageResult<PaymentNotification> list(String customerId, int page, int size) {
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException(
                    "page debe ser >= 0 y size debe estar entre 1 y " + MAX_PAGE_SIZE);
        }
        return notifications.findByCustomer(customerId, page, size);
    }

    @Transactional
    public PaymentNotification markRead(UUID id, String customerId) {
        PaymentNotification notification = notifications.findByIdAndCustomer(id, customerId)
                .orElseThrow(() -> new NotificationNotFoundException(id));
        notification.markRead(clock.instant());
        return notifications.save(notification);
    }
}
