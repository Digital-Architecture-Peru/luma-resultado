package com.banca.internet.tarjetas.atoms;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Modelo de dominio de una tarjeta (sin PAN completo ni CVV). */
public record Card(
        long id,
        String customerId,
        MaskedPan pan,
        String brand,
        String cardType,
        CardStatus status,
        String currency,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        LocalDate expiryDate) {
}
