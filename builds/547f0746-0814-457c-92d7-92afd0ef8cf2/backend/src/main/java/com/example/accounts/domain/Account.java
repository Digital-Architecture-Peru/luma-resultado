package com.example.accounts.domain;

import java.math.BigDecimal;

public record Account(long id, String number, long customerId, String currency, BigDecimal balance) {

    public boolean canCover(BigDecimal amount) {
        return balance.compareTo(amount) >= 0;
    }
}
