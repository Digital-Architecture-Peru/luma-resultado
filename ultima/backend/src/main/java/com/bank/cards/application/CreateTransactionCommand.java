package com.bank.cards.application;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateTransactionCommand(
        UUID cardId,
        BigDecimal amount,
        String currency,
        String sourceAccountId,
        String description,
        String idempotencyKey) {
}
