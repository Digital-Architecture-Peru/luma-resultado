package com.banco.cards.adapter;

import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;

/** Entidad de persistencia (tabla card). Detalle de infraestructura, no sale del adaptador. */
@Entity
@Table(name = "card")
public class CardEntity {

    @Id
    public UUID id;

    @Column(name = "customer_id")
    public String customerId;

    @Column(name = "card_token")
    public String cardToken;

    @Column(name = "pan_last4", columnDefinition = "bpchar(4)")
    public String panLast4;

    public String brand;

    @Enumerated(EnumType.STRING)
    public CardType type;

    @Enumerated(EnumType.STRING)
    public CardStatus status;

    public String alias;

    @Column(name = "credit_limit")
    public BigDecimal creditLimit;

    @Column(name = "available_balance")
    public BigDecimal availableBalance;

    @Column(columnDefinition = "bpchar(3)")
    public String currency;

    @Column(name = "expiry_month")
    public int expiryMonth;

    @Column(name = "expiry_year")
    public int expiryYear;

    @Column(name = "cutoff_day")
    public int cutoffDay;
}
