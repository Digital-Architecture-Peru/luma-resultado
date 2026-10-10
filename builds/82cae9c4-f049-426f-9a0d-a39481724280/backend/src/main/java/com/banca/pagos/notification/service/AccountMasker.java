package com.banca.pagos.notification.service;

/** Enmascara números de cuenta para no persistirlos ni mostrarlos completos. */
public final class AccountMasker {

    private static final String MASK = "****";
    private static final int VISIBLE_DIGITS = 4;

    private AccountMasker() {
    }

    public static String mask(String accountNumber) {
        if (accountNumber == null) {
            return MASK;
        }
        String compact = accountNumber.replaceAll("[^A-Za-z0-9]", "");
        if (compact.length() <= VISIBLE_DIGITS) {
            return MASK;
        }
        return MASK + compact.substring(compact.length() - VISIBLE_DIGITS);
    }
}
