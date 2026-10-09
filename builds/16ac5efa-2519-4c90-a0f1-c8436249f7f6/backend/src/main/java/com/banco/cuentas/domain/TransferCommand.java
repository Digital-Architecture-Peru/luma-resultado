package com.banco.cuentas.domain;

import java.math.BigDecimal;

public record TransferCommand(
        String ownerId,
        String idempotencyKey,
        long sourceId,
        long targetId,
        BigDecimal amount,
        String currency,
        String description) {
}
