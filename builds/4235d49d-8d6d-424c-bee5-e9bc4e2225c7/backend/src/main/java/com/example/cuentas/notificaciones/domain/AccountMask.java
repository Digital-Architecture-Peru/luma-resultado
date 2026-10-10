package com.example.cuentas.notificaciones.domain;

/** Enmascara el número de cuenta para no exponerlo completo (PII). */
public final class AccountMask {

    private static final int VISIBLE = 4;
    private static final String PREFIX = "****";

    private AccountMask() {
    }

    public static String mask(String accountId) {
        if (accountId == null || accountId.isBlank()) {
            return PREFIX;
        }
        int start = Math.max(0, accountId.length() - VISIBLE);
        return PREFIX + accountId.substring(start);
    }
}
