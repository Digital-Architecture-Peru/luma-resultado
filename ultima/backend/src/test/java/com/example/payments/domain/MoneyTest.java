package com.example.payments.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class MoneyTest {

    @Test
    void givenIntegerAmount_whenCreated_thenScaleIsTwo() {
        assertEquals("10.00", Money.of("10", "EUR").value().toPlainString());
    }

    @Test
    void givenZeroOrNegative_whenCreated_thenRejected() {
        assertThrows(IllegalArgumentException.class, () -> Money.of("0", "EUR"));
        assertThrows(IllegalArgumentException.class, () -> Money.of("-5.00", "EUR"));
    }

    @Test
    void givenThreeDecimals_whenCreated_thenRejected() {
        assertThrows(IllegalArgumentException.class, () -> Money.of("1.234", "EUR"));
    }

    @Test
    void givenInvalidCurrencyOrText_whenCreated_thenRejected() {
        assertThrows(IllegalArgumentException.class, () -> Money.of("1.00", "eur"));
        assertThrows(IllegalArgumentException.class, () -> Money.of("abc", "EUR"));
    }

    @Test
    void givenLimit_whenCompared_thenOnlyStrictlyGreaterExceeds() {
        Money m = Money.of("100.00", "EUR");
        assertTrue(m.isGreaterThan(new BigDecimal("99.99")));
        assertFalse(m.isGreaterThan(new BigDecimal("100.00")));
    }
}
