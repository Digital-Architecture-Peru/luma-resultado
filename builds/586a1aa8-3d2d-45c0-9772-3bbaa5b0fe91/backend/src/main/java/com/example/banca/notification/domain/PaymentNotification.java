package com.example.banca.notification.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PaymentNotification {

    private final UUID id;
    private final String customerId;
    private final String paymentId;
    private final EventType eventType;
    private final BigDecimal amount;
    private final String currency;
    private final String maskedAccount;
    private final Instant createdAt;
    private NotificationStatus status;
    private Instant readAt;

    /** Reconstituye una notificación existente (p. ej. desde la base de datos). */
    public PaymentNotification(UUID id, String customerId, String paymentId, EventType eventType,
                               BigDecimal amount, String currency, String maskedAccount,
                               NotificationStatus status, Instant createdAt, Instant readAt) {
        this.id = id;
        this.customerId = customerId;
        this.paymentId = paymentId;
        this.eventType = eventType;
        this.amount = amount;
        this.currency = currency;
        this.maskedAccount = maskedAccount;
        this.status = status;
        this.createdAt = createdAt;
        this.readAt = readAt;
    }

    public static PaymentNotification newUnread(UUID id, PaymentEvent event, Instant now) {
        return new PaymentNotification(id, event.customerId(), event.paymentId(), event.eventType(),
                event.amount(), event.currency(), AccountMask.mask(event.accountNumber()),
                NotificationStatus.UNREAD, now, null);
    }

    /** Idempotente: si ya estaba leída conserva la fecha original. */
    public void markRead(Instant now) {
        if (status == NotificationStatus.READ) {
            return;
        }
        status = NotificationStatus.READ;
        readAt = now;
    }

    public UUID id() { return id; }
    public String customerId() { return customerId; }
    public String paymentId() { return paymentId; }
    public EventType eventType() { return eventType; }
    public BigDecimal amount() { return amount; }
    public String currency() { return currency; }
    public String maskedAccount() { return maskedAccount; }
    public Instant createdAt() { return createdAt; }
    public NotificationStatus status() { return status; }
    public Instant readAt() { return readAt; }
}
