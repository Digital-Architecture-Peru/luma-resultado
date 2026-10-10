package com.example.notifications.application;

import com.example.notifications.domain.Notification;
import com.example.notifications.domain.NotificationStatus;
import com.example.notifications.domain.NotificationType;
import com.example.notifications.port.NotificationChannel;
import com.example.notifications.port.NotificationRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final int VISIBLE_DIGITS = 4;

    private final NotificationRepository repository;
    private final NotificationChannel channel;
    private final Clock clock;

    public NotificationService(NotificationRepository repository, NotificationChannel channel, Clock clock) {
        this.repository = repository;
        this.channel = channel;
        this.clock = clock;
    }

    /** Crea la notificación; es idempotente por (referencia de pago, tipo). */
    public Notification create(String customerId, String paymentReference, NotificationType type,
                               BigDecimal amount, String currency, String account) {
        return repository.findByReferenceAndType(paymentReference, type).orElseGet(() -> {
            Notification draft = new Notification(null, customerId, paymentReference, type, amount,
                    currency.toUpperCase(), maskAccount(account), NotificationStatus.UNREAD,
                    Instant.now(clock), null);
            Notification saved = repository.save(draft);
            channel.send(saved);
            return saved;
        });
    }

    public List<Notification> list(String customerId, NotificationStatus status) {
        return repository.findByCustomer(customerId, status);
    }

    public Notification markAsRead(long id, String customerId) {
        Notification current = repository.findByIdAndCustomer(id, customerId)
                .orElseThrow(() -> new NotificationNotFoundException(id));
        if (current.isRead()) {
            return current;
        }
        Instant now = Instant.now(clock);
        repository.markRead(id, customerId, now);
        return current.markedRead(now);
    }

    static String maskAccount(String account) {
        String digits = account == null ? "" : account.replaceAll("\\D", "");
        if (digits.length() < VISIBLE_DIGITS) {
            throw new IllegalArgumentException("La cuenta debe tener al menos 4 dígitos");
        }
        return "****" + digits.substring(digits.length() - VISIBLE_DIGITS);
    }
}
