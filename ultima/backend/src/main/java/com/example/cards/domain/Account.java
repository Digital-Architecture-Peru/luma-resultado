package com.example.cards.domain;

import java.math.BigDecimal;

public record Account(
        String id,
        String customerId,
        String alias,
        BigDecimal balance,
        long version) {
}
