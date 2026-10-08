package com.banco.cards.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/** Tarjeta del cliente. Solo guarda los últimos 4 dígitos del PAN; nunca PAN completo ni CVV. */
@Entity
@Table(name = "card")
public class Card {

    @Id
    private UUID id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "pan_last4", nullable = false, length = 4)
    private String panLast4;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardStatus status;

    @Column(name = "credit_limit", nullable = false)
    private BigDecimal creditLimit;

    @Column(name = "available_balance", nullable = false)
    private BigDecimal availableBalance;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(name = "expiry_month", nullable = false)
    private int expiryMonth;

    @Column(name = "expiry_year", nullable = false)
    private int expiryYear;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected Card() {
    }

    public Card(UUID id, String customerId, String panLast4, CardType type, CardStatus status,
                BigDecimal creditLimit, BigDecimal availableBalance, String currency,
                int expiryMonth, int expiryYear, OffsetDateTime createdAt) {
        this.id = id;
        this.customerId = customerId;
        this.panLast4 = panLast4;
        this.type = type;
        this.status = status;
        this.creditLimit = creditLimit;
        this.availableBalance = availableBalance;
        this.currency = currency;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getCustomerId() { return customerId; }
    public String getPanLast4() { return panLast4; }
    public CardType getType() { return type; }
    public CardStatus getStatus() { return status; }
    public BigDecimal getCreditLimit() { return creditLimit; }
    public BigDecimal getAvailableBalance() { return availableBalance; }
    public String getCurrency() { return currency; }
    public int getExpiryMonth() { return expiryMonth; }
    public int getExpiryYear() { return expiryYear; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
