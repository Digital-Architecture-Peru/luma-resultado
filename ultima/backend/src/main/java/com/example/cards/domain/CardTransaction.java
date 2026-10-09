package com.example.cards.domain;

import java.math.BigDecimal;
import java.time.Instant;

public record CardTransaction(
        String id,
        String cardId,
        String type,
        BigDecimal amount,
        String status,
        String idempotencyKey,
        Instant createdAt) {

    public static final String TYPE_PAYMENT = "PAYMENT";
    public static final String STATUS_POSTED = "POSTED";
}
