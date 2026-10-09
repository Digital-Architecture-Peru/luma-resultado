package com.example.cards.domain;

import java.math.BigDecimal;

/** Tarjeta de crédito. Solo se conservan los últimos 4 dígitos; el PAN completo nunca se almacena. */
public record Card(
        String id,
        String customerId,
        String last4,
        String brand,
        BigDecimal creditLimit,
        BigDecimal balance,
        long version) {
}
