package com.banco.payments.application;

import java.math.BigDecimal;

public record CreatePaymentCommand(
        String originAccount,
        String beneficiary,
        BigDecimal amount,
        String currency,
        String concept,
        String idempotencyKey) {
}
