package com.banco.cards.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Tarjeta del cliente. Solo se conservan los ultimos 4 digitos y el PAN enmascarado:
 * nunca el PAN completo, el CVV ni la fecha de vencimiento.
 * creditLimit es null para tarjetas de debito.
 */
public record Card(
        UUID id,
        String customerId,
        String panLast4,
        String maskedPan,
        String brand,
        String cardType,
        CardStatus status,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency,
        Instant createdAt) {
}
