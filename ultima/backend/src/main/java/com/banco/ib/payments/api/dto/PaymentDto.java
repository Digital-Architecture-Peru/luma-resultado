package com.banco.ib.payments.api.dto;

import com.banco.ib.payments.domain.Payment;

/** Monto como String para no perder precisión en el cliente. */
public record PaymentDto(
        String id,
        String reference,
        String beneficiaryName,
        String beneficiaryAccountMasked,
        String amount,
        String currency,
        String status,
        String executedAt) {

    public static PaymentDto from(Payment p) {
        return new PaymentDto(
                p.id().toString(),
                p.reference(),
                p.beneficiaryName(),
                p.beneficiaryAccountMasked(),
                p.amount().toPlainString(),
                p.currency(),
                p.status().name(),
                p.executedAt() == null ? null : p.executedAt().toString());
    }
}
