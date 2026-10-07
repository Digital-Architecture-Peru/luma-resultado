package com.banca.tarjetas.dto;

import java.math.BigDecimal;

public record CardSummaryDto(
        String id,
        String maskedPan,
        String brand,
        String status,
        String expiry,
        BigDecimal availableBalance,
        String currency) {
}
