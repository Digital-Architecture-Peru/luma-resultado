package com.banco.payments.application;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentCommand(
        String customerId,
        String idempotencyKey,
        UUID sourceAccountId,
        String targetAccount,
        BigDecimal amount,
        String currency,
        String reference) {
}
