package com.banco.cuentas.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record Transfer(
        UUID id,
        String idempotencyKey,
        long sourceId,
        long targetId,
        BigDecimal amount,
        String currency,
        String description,
        String status,
        Instant createdAt) {

    public static final String COMPLETED = "COMPLETED";

    /** Un reintento legitimo repite exactamente la misma peticion. */
    public boolean samePayload(TransferCommand command) {
        return sourceId == command.sourceId()
                && targetId == command.targetId()
                && amount.compareTo(command.amount()) == 0
                && currency.equals(command.currency());
    }
}
