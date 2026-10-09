package com.banco.cuentas.domain;

import java.math.BigDecimal;

public record Account(long id, String numberMasked, String ownerId, String currency, BigDecimal balance) {

    public boolean canCover(BigDecimal amount) {
        return balance.compareTo(amount) >= 0;
    }
}
