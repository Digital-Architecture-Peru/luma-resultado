package com.banca.tarjetas.model;

import java.math.BigDecimal;
import java.time.YearMonth;

/** Entidad de dominio. El PAN completo nunca sale de esta capa. */
public record Card(
        String id,
        String pan,
        String holderName,
        String brand,
        CardStatus status,
        YearMonth expiry,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency) {
}
