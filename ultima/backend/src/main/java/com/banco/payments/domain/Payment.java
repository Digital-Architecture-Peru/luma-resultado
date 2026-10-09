package com.banco.payments.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record Payment(
        UUID id,
        String idempotencyKey,
        UUID sourceAccountId,
        String targetAccount,
        BigDecimal amount,
        String currency,
        PaymentStatus status,
        String reference,
        Instant createdAt) {

    public Payment withStatus(PaymentStatus newStatus) {
        return new Payment(id, idempotencyKey, sourceAccountId, targetAccount, amount,
                currency, newStatus, reference, createdAt);
    }

    /** Un reintento con la misma clave solo es valido si describe el mismo pago. */
    public boolean isSameRequest(UUID source, String target, BigDecimal requestedAmount, String requestedCurrency) {
        return sourceAccountId.equals(source)
                && targetAccount.equals(target)
                && amount.compareTo(requestedAmount) == 0
                && currency.equals(requestedCurrency);
    }
}
