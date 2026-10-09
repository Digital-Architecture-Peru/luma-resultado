package com.example.payments.api.dto;

import com.example.payments.domain.Payment;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(UUID id, String status, String sourceAccount, String beneficiary,
                              String amount, String currency, String reference, Instant createdAt) {

    public static PaymentResponse from(Payment p) {
        return new PaymentResponse(p.id(), p.status().name(), p.sourceAccount(), p.beneficiary(),
                p.amount().value().toPlainString(), p.amount().currency(), p.reference(), p.createdAt());
    }
}
