package com.example.accounts.api;

import com.example.accounts.domain.Movement;
import java.time.Instant;

public record MovementResponse(long id, long transferId, String type, String amount, Instant createdAt) {

    public static MovementResponse from(Movement m) {
        return new MovementResponse(m.id(), m.transferId(), m.type(), m.amount().toPlainString(), m.createdAt());
    }
}
