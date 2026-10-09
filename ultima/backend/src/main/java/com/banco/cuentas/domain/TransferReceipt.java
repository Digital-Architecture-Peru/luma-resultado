package com.banco.cuentas.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Comprobante de una transferencia ya registrada. */
public record TransferReceipt(
        UUID id,
        @JsonIgnore String idempotencyKey,
        long sourceAccountId,
        long targetAccountId,
        @JsonFormat(shape = JsonFormat.Shape.STRING) BigDecimal amount,
        String currency,
        String description,
        Instant createdAt) {

    /** Indica si el comprobante corresponde a la misma solicitud (misma clave de idempotencia). */
    public boolean sameRequestAs(TransferCommand cmd) {
        return sourceAccountId == cmd.sourceAccountId()
                && targetAccountId == cmd.targetAccountId()
                && amount.compareTo(cmd.amount()) == 0
                && currency.equals(cmd.currency());
    }
}
