package com.example.banca.notification.adapters.out.persistence;

import com.example.banca.notification.domain.EventType;
import com.example.banca.notification.domain.NotificationStatus;
import com.example.banca.notification.domain.PaymentNotification;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payment_notification")
class NotificationEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String paymentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false)
    private String maskedAccount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant readAt;

    protected NotificationEntity() {
    }

    static NotificationEntity from(PaymentNotification n) {
        NotificationEntity e = new NotificationEntity();
        e.id = n.id();
        e.customerId = n.customerId();
        e.paymentId = n.paymentId();
        e.eventType = n.eventType();
        e.amount = n.amount();
        e.currency = n.currency();
        e.maskedAccount = n.maskedAccount();
        e.status = n.status();
        e.createdAt = n.createdAt();
        e.readAt = n.readAt();
        return e;
    }

    PaymentNotification toDomain() {
        return new PaymentNotification(id, customerId, paymentId, eventType, amount, currency,
                maskedAccount, status, createdAt, readAt);
    }
}
