package com.example.cuentas.notificaciones.domain;

import java.math.BigDecimal;
import java.time.Instant;

public record Preference(
        String accountId,
        BigDecimal lowBalanceThreshold,
        boolean depositEnabled,
        boolean withdrawalEnabled,
        Instant updatedAt) {

    private static final BigDecimal DEFAULT_THRESHOLD = new BigDecimal("100.00");

    public static Preference defaults(String accountId, Instant now) {
        return new Preference(accountId, DEFAULT_THRESHOLD, true, true, now);
    }

    /** Indica si el cliente quiere recibir este evento según sus preferencias. */
    public boolean allows(NotificationType type, BigDecimal amount) {
        return switch (type) {
            case DEPOSIT -> depositEnabled;
            case WITHDRAWAL -> withdrawalEnabled;
            case LOW_BALANCE -> amount != null && amount.compareTo(lowBalanceThreshold) <= 0;
        };
    }
}
