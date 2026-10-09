package com.example.payments.domain;

import java.time.Instant;
import java.util.UUID;

/** Pago con transiciones de estado validadas: solo PENDING puede cambiar. */
public final class Payment {

    private final UUID id;
    private final String idempotencyKey;
    private final String sourceAccount;
    private final String beneficiary;
    private final Money amount;
    private final String reference;
    private final Instant createdAt;
    private PaymentStatus status;

    private Payment(UUID id, String idempotencyKey, String sourceAccount, String beneficiary,
                    Money amount, String reference, PaymentStatus status, Instant createdAt) {
        this.id = id;
        this.idempotencyKey = idempotencyKey;
        this.sourceAccount = sourceAccount;
        this.beneficiary = beneficiary;
        this.amount = amount;
        this.reference = reference;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static Payment create(String idempotencyKey, String sourceAccount, String beneficiary,
                                 Money amount, String reference, Instant now) {
        if (isBlank(sourceAccount) || isBlank(beneficiary)) {
            throw new IllegalArgumentException("Cuenta origen y beneficiario son obligatorios");
        }
        if (sourceAccount.equals(beneficiary)) {
            throw new IllegalArgumentException("El beneficiario no puede ser la cuenta origen");
        }
        return new Payment(UUID.randomUUID(), idempotencyKey, sourceAccount, beneficiary,
                amount, reference, PaymentStatus.PENDING, now);
    }

    public static Payment restore(UUID id, String idempotencyKey, String sourceAccount, String beneficiary,
                                  Money amount, String reference, PaymentStatus status, Instant createdAt) {
        return new Payment(id, idempotencyKey, sourceAccount, beneficiary, amount, reference, status, createdAt);
    }

    public void complete() {
        transitionTo(PaymentStatus.COMPLETED);
    }

    public void reject() {
        transitionTo(PaymentStatus.REJECTED);
    }

    public boolean sameRequestAs(String otherSource, String otherBeneficiary, Money otherAmount) {
        return sourceAccount.equals(otherSource)
                && beneficiary.equals(otherBeneficiary)
                && amount.equals(otherAmount);
    }

    private void transitionTo(PaymentStatus target) {
        if (status != PaymentStatus.PENDING) {
            throw new IllegalStateException("Transicion invalida: " + status + " -> " + target);
        }
        status = target;
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    public UUID id() { return id; }
    public String idempotencyKey() { return idempotencyKey; }
    public String sourceAccount() { return sourceAccount; }
    public String beneficiary() { return beneficiary; }
    public Money amount() { return amount; }
    public String reference() { return reference; }
    public PaymentStatus status() { return status; }
    public Instant createdAt() { return createdAt; }
}
