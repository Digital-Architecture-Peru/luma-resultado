package com.banco.accounts.api;

import com.banco.accounts.domain.Account;

/** Vista publica de una cuenta: numero enmascarado y saldo como decimal en texto. */
public record AccountDto(
        String id,
        String maskedNumber,
        String type,
        String currency,
        String balance,
        String status,
        String openedAt) {

    private static final int VISIBLE_DIGITS = 4;

    public static AccountDto from(Account account) {
        return new AccountDto(
                String.valueOf(account.id()),
                mask(account.accountNumber()),
                account.type(),
                account.currency(),
                account.balance().toPlainString(),
                account.status().name(),
                account.openedAt().toString());
    }

    static String mask(String number) {
        if (number == null || number.length() <= VISIBLE_DIGITS) {
            return "****";
        }
        return "****" + number.substring(number.length() - VISIBLE_DIGITS);
    }
}
