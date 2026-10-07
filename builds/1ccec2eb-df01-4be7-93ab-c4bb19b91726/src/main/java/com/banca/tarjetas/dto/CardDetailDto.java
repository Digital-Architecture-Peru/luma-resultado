package com.banca.tarjetas.dto;

import java.math.BigDecimal;

public record CardDetailDto(
        String id,
        String maskedPan,
        String holderName,
        String brand,
        String status,
        String expiry,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency) {
}
