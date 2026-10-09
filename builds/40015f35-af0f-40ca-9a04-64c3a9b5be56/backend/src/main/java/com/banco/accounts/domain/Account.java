package com.banco.accounts.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record Account(
        UUID id,
        String customerId,
        String accountNumber,
        String type,
        String currency,
        BigDecimal balance,
        String status,
        Instant updatedAt) {
}
