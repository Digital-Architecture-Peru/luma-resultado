package com.banco.payments.adapter.web.dto;

import com.banco.payments.domain.Account;
import java.math.BigDecimal;
import java.util.UUID;

public record AccountResponse(UUID id, String number, String currency, BigDecimal balance) {

    public static AccountResponse from(Account a) {
        return new AccountResponse(a.id(), a.number(), a.currency(), a.balance());
    }
}
