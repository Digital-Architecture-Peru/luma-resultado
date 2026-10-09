package com.banco.cuentas.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;

/** Cuenta propia del cliente. El saldo se serializa como texto para no perder precisión. */
public record Account(
        long id,
        String number,
        String holderAlias,
        String currency,
        @JsonFormat(shape = JsonFormat.Shape.STRING) BigDecimal balance) {

    public Account withBalance(BigDecimal newBalance) {
        return new Account(id, number, holderAlias, currency, newBalance);
    }
}
