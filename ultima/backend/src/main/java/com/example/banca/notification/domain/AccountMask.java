package com.example.banca.notification.domain;

/** Enmascara números de cuenta: solo se conservan los últimos 4 caracteres. Es idempotente. */
public final class AccountMask {

    private static final String PREFIX = "****";
    private static final int VISIBLE = 4;

    private AccountMask() {
    }

    public static String mask(String account) {
        if (account == null) {
            return PREFIX;
        }
        String trimmed = account.trim();
        if (trimmed.length() <= VISIBLE) {
            return PREFIX;
        }
        return PREFIX + trimmed.substring(trimmed.length() - VISIBLE);
    }
}
