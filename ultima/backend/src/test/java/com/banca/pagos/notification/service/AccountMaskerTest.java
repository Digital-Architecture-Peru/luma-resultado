package com.banca.pagos.notification.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class AccountMaskerTest {

    @Test
    void givenLongAccount_whenMask_thenKeepsLastFourDigits() {
        assertEquals("****7890", AccountMasker.mask("1234567890"));
    }

    @Test
    void givenFormattedAccount_whenMask_thenIgnoresSeparators() {
        assertEquals("****4321", AccountMasker.mask("12-34 5678-4321"));
    }

    @Test
    void givenShortOrNullAccount_whenMask_thenFullyMasked() {
        assertEquals("****", AccountMasker.mask("1234"));
        assertEquals("****", AccountMasker.mask(null));
    }
}
