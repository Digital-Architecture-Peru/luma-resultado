package com.banco.cards.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CardTransaction(UUID id, UUID cardId, TransactionType type, BigDecimal amount,
                              String currency, String description, Status status,
                              String idempotencyKey, Instant createdAt) {

    public enum Status { APPROVED, DECLINED }
}
