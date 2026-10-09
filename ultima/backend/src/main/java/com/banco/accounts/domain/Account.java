package com.banco.accounts.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Account(
        long id,
        String customerId,
        String accountNumber,
        String type,
        String currency,
        BigDecimal balance,
        AccountStatus status,
        LocalDate openedAt) {
}
