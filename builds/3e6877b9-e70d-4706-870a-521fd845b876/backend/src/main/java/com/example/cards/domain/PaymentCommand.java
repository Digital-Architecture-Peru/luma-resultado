package com.example.cards.domain;

import java.math.BigDecimal;

public record PaymentCommand(String sourceAccountId, BigDecimal amount, String idempotencyKey) {
}
