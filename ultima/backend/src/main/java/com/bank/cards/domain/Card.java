package com.bank.cards.domain;

import java.math.BigDecimal;
import java.util.UUID;

/** Tarjeta con PAN siempre enmascarado (nunca PAN completo ni CVV). */
public record Card(
        UUID id,
        String customerId,
        String maskedPan,
        String brand,
        String status,
        BigDecimal creditLimit,
        BigDecimal availableBalance) {

    private static final String ACTIVE = "ACTIVE";

    public boolean isActive() {
        return ACTIVE.equals(status);
    }
}
