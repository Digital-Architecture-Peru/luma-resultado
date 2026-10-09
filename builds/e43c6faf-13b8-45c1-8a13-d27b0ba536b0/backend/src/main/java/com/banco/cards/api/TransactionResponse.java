package com.banco.cards.api;

import com.banco.cards.domain.CardTransaction;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionResponse(UUID id, UUID cardId, String type, BigDecimal amount, String currency,
                                  String description, String status, Instant createdAt) {

    public static TransactionResponse from(CardTransaction t) {
        return new TransactionResponse(t.id(), t.cardId(), t.type().name(), t.amount(), t.currency(),
                t.description(), t.status().name(), t.createdAt());
    }
}
