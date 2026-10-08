package com.banco.cards.domain;

import java.math.BigDecimal;
import java.util.UUID;

/** Tarjeta del cliente. Nunca contiene el PAN completo ni el CVV. */
public record Card(
        UUID id,
        UUID customerId,
        String last4,
        String brand,
        CardType type,
        CardStatus status,
        String holderName,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency) {

    public String maskedNumber() {
        return "**** **** **** " + last4;
    }
}
