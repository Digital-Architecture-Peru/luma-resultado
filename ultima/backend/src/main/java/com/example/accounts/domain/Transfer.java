package com.example.accounts.domain;

import java.math.BigDecimal;
import java.time.Instant;

public record Transfer(
        Long id,
        String idempotencyKey,
        long sourceAccountId,
        long targetAccountId,
        BigDecimal amount,
        String currency,
        String description,
        String status,
        Instant createdAt) {

    public static final String STATUS_COMPLETED = "COMPLETED";

    public Transfer withId(long newId) {
        return new Transfer(newId, idempotencyKey, sourceAccountId, targetAccountId, amount,
                currency, description, status, createdAt);
    }
}
