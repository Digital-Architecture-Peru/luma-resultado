package com.banco.payments.domain;

/** Ciclo de vida: PENDING -> COMPLETED | REJECTED. */
public enum PaymentStatus {
    PENDING,
    COMPLETED,
    REJECTED
}
