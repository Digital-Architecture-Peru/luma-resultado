package com.banco.payments.adapter.gateway;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banco.payments.domain.Payment;
import com.banco.payments.domain.PaymentStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class FakePaymentGatewayTest {

    private final FakePaymentGateway gateway = new FakePaymentGateway();

    private Payment to(String target) {
        return new Payment(UUID.randomUUID(), "k", UUID.randomUUID(), target,
                new BigDecimal("1.00"), "USD", PaymentStatus.PENDING, null, Instant.EPOCH);
    }

    @Test
    void givenRegularTarget_whenAuthorize_thenApproved() {
        assertTrue(gateway.authorize(to("EC00-9999-0001")));
    }

    @Test
    void givenTargetEndingInZeros_whenAuthorize_thenRejected() {
        assertFalse(gateway.authorize(to("EC00-9999-0000")));
    }
}
