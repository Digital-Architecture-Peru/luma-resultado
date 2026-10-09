package com.example.accounts.api;

import com.example.accounts.domain.Account;

public record AccountResponse(long id, String number, String currency, String balance) {

    public static AccountResponse from(Account a) {
        return new AccountResponse(a.id(), a.number(), a.currency(), a.balance().toPlainString());
    }
}
