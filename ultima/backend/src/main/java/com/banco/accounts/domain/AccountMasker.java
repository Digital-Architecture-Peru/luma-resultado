package com.banco.accounts.domain;

/** Enmascara números de cuenta para no exponer el dato completo en el canal. */
public final class AccountMasker {

    private static final int VISIBLE_DIGITS = 4;
    private static final String MASK = "****";

    private AccountMasker() {
    }

    public static String mask(String accountNumber) {
        if (accountNumber == null || accountNumber.length() <= VISIBLE_DIGITS) {
            return MASK;
        }
        return MASK + accountNumber.substring(accountNumber.length() - VISIBLE_DIGITS);
    }
}
