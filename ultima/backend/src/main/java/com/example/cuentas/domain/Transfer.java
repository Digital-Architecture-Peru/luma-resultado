package com.example.cuentas.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transfer")
public class Transfer {

    public static final String STATUS_COMPLETED = "COMPLETED";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "idempotency_key", nullable = false, unique = true)
    private String idempotencyKey;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    private String description;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Transfer() {
        // requerido por JPA
    }

    public static Transfer completed(String idempotencyKey, Long sourceId, Long targetId,
                                     BigDecimal amount, String currency, String description, Instant now) {
        Transfer t = new Transfer();
        t.idempotencyKey = idempotencyKey;
        t.sourceId = sourceId;
        t.targetId = targetId;
        t.amount = amount;
        t.currency = currency;
        t.description = description;
        t.status = STATUS_COMPLETED;
        t.createdAt = now;
        return t;
    }

    public Long getId() { return id; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public Long getSourceId() { return sourceId; }
    public Long getTargetId() { return targetId; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
