package com.example.payments.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Instant;
import org.junit.jupiter.api.Test;

class PaymentTest {

    private static Payment newPayment() {
        return Payment.create("key-1", "ES00-FAKE-0001", "ES00-FAKE-9001",
                Money.of("10.00", "EUR"), "ref", Instant.parse("2026-01-01T00:00:00Z"));
    }

    @Test
    void givenNewPayment_thenStatusIsPending() {
        assertEquals(PaymentStatus.PENDING, newPayment().status());
    }

    @Test
    void givenPending_whenCompleted_thenCompleted() {
        Payment p = newPayment();
        p.complete();
        assertEquals(PaymentStatus.COMPLETED, p.status());
    }

    @Test
    void givenCompleted_whenRejected_thenIllegalState() {
        Payment p = newPayment();
        p.complete();
        assertThrows(IllegalStateException.class, p::reject);
    }

    @Test
    void givenRejected_whenCompleted_thenIllegalState() {
        Payment p = newPayment();
        p.reject();
        assertThrows(IllegalStateException.class, p::complete);
    }

    @Test
    void givenSameSourceAndBeneficiary_whenCreated_thenRejected() {
        assertThrows(IllegalArgumentException.class, () -> Payment.create("k", "A", "A",
                Money.of("1.00", "EUR"), null, Instant.now()));
    }
}
