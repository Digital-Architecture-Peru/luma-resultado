package com.banco.payments.adapter.web.dto;

import com.banco.payments.domain.Payment;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        String status,
        UUID sourceAccountId,
        String targetAccount,
        BigDecimal amount,
        String currency,
        String reference,
        Instant createdAt) {

    public static PaymentResponse from(Payment p) {
        return new PaymentResponse(p.id(), p.status().name(), p.sourceAccountId(), p.targetAccount(),
                p.amount(), p.currency(), p.reference(), p.createdAt());
    }
}
