package com.bank.cards.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CardTransaction(
        UUID id,
        UUID cardId,
        BigDecimal amount,
        String currency,
        String sourceAccountId,
        String description,
        TransactionStatus status,
        String idempotencyKey,
        Instant createdAt) {
}
