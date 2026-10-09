package com.banco.accounts.api.dto;

import com.banco.accounts.domain.Account;
import com.banco.accounts.domain.AccountMasker;
import java.time.Instant;
import java.util.UUID;

/** Vista pública de una cuenta: número enmascarado y saldo como texto decimal. */
public record AccountDto(
        UUID id,
        String maskedNumber,
        String type,
        String currency,
        String balance,
        String status,
        Instant updatedAt) {

    public static AccountDto from(Account account) {
        return new AccountDto(
                account.id(),
                AccountMasker.mask(account.accountNumber()),
                account.type(),
                account.currency(),
                account.balance().setScale(2, java.math.RoundingMode.UNNECESSARY).toPlainString(),
                account.status(),
                account.updatedAt());
    }
}
