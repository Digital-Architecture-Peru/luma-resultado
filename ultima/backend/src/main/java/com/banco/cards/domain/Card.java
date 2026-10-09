package com.banco.cards.domain;

import java.math.BigDecimal;
import java.util.UUID;

/** Tarjeta del cliente (modelo de dominio, solo lectura). Nunca contiene el PAN completo. */
public record Card(
        UUID id,
        String customerId,
        String panLast4,
        String brand,
        CardType type,
        CardStatus status,
        String alias,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency,
        int expiryMonth,
        int expiryYear,
        int cutoffDay) {
}
