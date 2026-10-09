package com.banco.payments.api;

import com.banco.payments.domain.Payment;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        String status,
        String beneficiary,
        BigDecimal amount,
        String currency,
        String concept,
        Instant createdAt) {

    public static PaymentResponse from(Payment p) {
        return new PaymentResponse(p.id(), p.status().name(), p.beneficiary(), p.amount(),
                p.currency(), p.concept(), p.createdAt());
    }
}
