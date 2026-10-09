package com.example.payments.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.regex.Pattern;

/** Importe positivo con 2 decimales y moneda ISO de 3 letras. */
public record Money(BigDecimal value, String currency) {

    private static final Pattern CURRENCY = Pattern.compile("^[A-Z]{3}$");

    public Money {
        if (value == null || value.signum() <= 0) {
            throw new IllegalArgumentException("El importe debe ser mayor que cero");
        }
        if (value.stripTrailingZeros().scale() > 2) {
            throw new IllegalArgumentException("El importe admite como maximo 2 decimales");
        }
        if (currency == null || !CURRENCY.matcher(currency).matches()) {
            throw new IllegalArgumentException("La moneda debe ser un codigo de 3 letras mayusculas");
        }
        value = value.setScale(2, RoundingMode.UNNECESSARY);
    }

    public static Money of(String amount, String currency) {
        try {
            return new Money(new BigDecimal(amount), currency);
        } catch (NumberFormatException | NullPointerException e) {
            throw new IllegalArgumentException("Importe no numerico");
        }
    }

    public boolean isGreaterThan(BigDecimal limit) {
        return value.compareTo(limit) > 0;
    }
}
