package com.banco.cuentas.domain;

import java.math.BigDecimal;

/** Solicitud de transferencia ya con la clave de idempotencia. Los campos pueden venir nulos: los valida TransferValidator. */
public record TransferCommand(
        String idempotencyKey,
        Long sourceAccountId,
        Long targetAccountId,
        BigDecimal amount,
        String currency,
        String description) {
}
