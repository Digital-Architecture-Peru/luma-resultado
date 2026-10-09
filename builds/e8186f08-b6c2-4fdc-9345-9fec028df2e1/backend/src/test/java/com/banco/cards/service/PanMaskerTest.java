package com.banco.cards.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class PanMaskerTest {

    @Test
    void givenLast4_whenMask_thenShowsOnlyLastFourDigits() {
        assertEquals("**** **** **** 4242", PanMasker.mask("4242"));
    }

    @Test
    void givenInvalidInput_whenMask_thenThrows() {
        assertThrows(IllegalArgumentException.class, () -> PanMasker.mask(null));
        assertThrows(IllegalArgumentException.class, () -> PanMasker.mask("12a4"));
        assertThrows(IllegalArgumentException.class, () -> PanMasker.mask("4111111111111111"));
    }
}
