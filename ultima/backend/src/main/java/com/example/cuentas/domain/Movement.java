package com.example.cuentas.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

/** Asiento del libro de movimientos: un débito y un crédito por transferencia. */
@Entity
@Table(name = "movement")
public class Movement {

    public enum Type { DEBIT, CREDIT }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_id", nullable = false)
    private Long accountId;

    @Column(name = "transfer_id", nullable = false)
    private Long transferId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Movement() {
        // requerido por JPA
    }

    private Movement(Long accountId, Long transferId, Type type, BigDecimal amount, Instant createdAt) {
        this.accountId = accountId;
        this.transferId = transferId;
        this.type = type;
        this.amount = amount;
        this.createdAt = createdAt;
    }

    public static Movement debit(Long accountId, Long transferId, BigDecimal amount, Instant at) {
        return new Movement(accountId, transferId, Type.DEBIT, amount, at);
    }

    public static Movement credit(Long accountId, Long transferId, BigDecimal amount, Instant at) {
        return new Movement(accountId, transferId, Type.CREDIT, amount, at);
    }

    public Long getId() { return id; }
    public Long getAccountId() { return accountId; }
    public Long getTransferId() { return transferId; }
    public Type getType() { return type; }
    public BigDecimal getAmount() { return amount; }
    public Instant getCreatedAt() { return createdAt; }
}
