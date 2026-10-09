package com.example.accounts.domain;

import java.math.BigDecimal;

public record TransferCommand(
        long sourceAccountId,
        long targetAccountId,
        BigDecimal amount,
        String currency,
        String description) {
}
