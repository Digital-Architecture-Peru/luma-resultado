package com.bank.cards.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Tarjeta del cliente. Nunca contiene el PAN completo: solo los ultimos 4 digitos.
 */
public record Card(
        UUID id,
        String customerId,
        String alias,
        String last4,
        CardType type,
        CardStatus status,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency,
        LocalDate expiryDate) {
}
