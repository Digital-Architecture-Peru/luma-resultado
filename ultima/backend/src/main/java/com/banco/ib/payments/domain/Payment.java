package com.banco.ib.payments.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Pago del cliente. {@code executedAt} es nulo mientras el pago está pendiente. */
public record Payment(
        UUID id,
        String customerId,
        String reference,
        String beneficiaryName,
        String beneficiaryAccountMasked,
        BigDecimal amount,
        String currency,
        PaymentStatus status,
        Instant executedAt) {
}
