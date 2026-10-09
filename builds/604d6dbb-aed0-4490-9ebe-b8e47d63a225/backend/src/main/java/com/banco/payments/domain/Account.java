package com.banco.payments.domain;

import java.math.BigDecimal;
import java.util.UUID;

/** Cuenta propia del cliente. Inmutable: cada debito produce una nueva version. */
public record Account(
        UUID id,
        String customerId,
        String number,
        String currency,
        BigDecimal balance,
        long version) {

    public boolean canCover(BigDecimal amount) {
        return balance.compareTo(amount) >= 0;
    }

    public Account debit(BigDecimal amount) {
        if (!canCover(amount)) {
            throw new IllegalArgumentException("Saldo insuficiente");
        }
        return new Account(id, customerId, number, currency, balance.subtract(amount), version + 1);
    }
}
