package com.banca.notificaciones.notification.domain;

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
@Table(name = "notification")
public class Notification {

    @Id
    private UUID id;

    @Column(name = "account_id", nullable = false)
    private String accountId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String body;

    private BigDecimal amount;

    private String currency;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "read_at")
    private Instant readAt;

    protected Notification() {
        // requerido por JPA
    }

    public static Notification create(UUID id, String accountId, NotificationType type, String title,
                                      String body, BigDecimal amount, String currency, Instant createdAt) {
        Notification n = new Notification();
        n.id = id;
        n.accountId = accountId;
        n.type = type;
        n.title = title;
        n.body = body;
        n.amount = amount;
        n.currency = currency;
        n.createdAt = createdAt;
        return n;
    }

    public void markRead(Instant now) {
        if (readAt != null) {
            throw DomainException.conflict("La notificación ya fue marcada como leída.");
        }
        this.readAt = now;
    }

    public UUID getId() {
        return id;
    }

    public String getAccountId() {
        return accountId;
    }

    public NotificationType getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getBody() {
        return body;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getReadAt() {
        return readAt;
    }
}
