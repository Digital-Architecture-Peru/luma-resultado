package com.example.accounts.api;

import com.example.accounts.domain.Transfer;
import java.time.Instant;

public record TransferResponse(long id, long sourceAccountId, long targetAccountId, String amount,
                               String currency, String status, Instant createdAt) {

    public static TransferResponse from(Transfer t) {
        return new TransferResponse(t.id(), t.sourceAccountId(), t.targetAccountId(),
                t.amount().toPlainString(), t.currency(), t.status(), t.createdAt());
    }
}
