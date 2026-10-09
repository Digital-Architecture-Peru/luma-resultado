package com.banco.payments.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.time.Instant;
import org.junit.jupiter.api.Test;

class PaymentTest {

    private static final BigDecimal MAX = new BigDecimal("50000");
    private static final Instant NOW = Instant.parse("2026-01-01T00:00:00Z");

    private static Payment build(String account, BigDecimal amount, String currency, String key) {
        return Payment.create(account, "Empresa Demo", amount, currency, "Recibo", key, MAX, NOW);
    }

    @Test
    void givenValidData_whenCreate_thenPendingPayment() {
        Payment p = build("00012345678901", new BigDecimal("10.50"), "PEN", "k1");
        assertEquals(PaymentStatus.PENDIENTE, p.status());
        assertEquals("k1", p.idempotencyKey());
    }

    @Test
    void givenZeroAmount_whenCreate_thenInvalid() {
        assertThrows(InvalidPaymentException.class,
                () -> build("00012345678901", BigDecimal.ZERO, "PEN", null));
    }

    @Test
    void givenNegativeAmount_whenCreate_thenInvalid() {
        assertThrows(InvalidPaymentException.class,
                () -> build("00012345678901", new BigDecimal("-1"), "PEN", null));
    }

    @Test
    void givenAmountAboveMax_whenCreate_thenInvalid() {
        assertThrows(InvalidPaymentException.class,
                () -> build("00012345678901", new BigDecimal("50000.01"), "PEN", null));
    }

    @Test
    void givenThreeDecimals_whenCreate_thenInvalid() {
        assertThrows(InvalidPaymentException.class,
                () -> build("00012345678901", new BigDecimal("1.001"), "PEN", null));
    }

    @Test
    void givenUnsupportedCurrency_whenCreate_thenInvalid() {
        assertThrows(InvalidPaymentException.class,
                () -> build("00012345678901", BigDecimal.TEN, "EUR", null));
    }

    @Test
    void givenShortAccount_whenCreate_thenInvalid() {
        assertThrows(InvalidPaymentException.class, () -> build("123", BigDecimal.TEN, "PEN", null));
    }

    @Test
    void givenPending_whenConfirm_thenConfirmed() {
        Payment p = build("00012345678901", BigDecimal.TEN, "USD", null).confirm();
        assertEquals(PaymentStatus.CONFIRMADO, p.status());
    }

    @Test
    void givenConfirmed_whenReject_thenInvalidTransition() {
        Payment p = build("00012345678901", BigDecimal.TEN, "USD", null).confirm();
        assertThrows(InvalidPaymentException.class, p::reject);
    }

    @Test
    void givenAccount_whenMask_thenOnlyLastFourDigitsVisible() {
        Payment p = build("00012345678901", BigDecimal.TEN, "USD", null);
        assertEquals("**********8901", p.maskedOriginAccount());
        assertNull(p.idempotencyKey());
    }
}
