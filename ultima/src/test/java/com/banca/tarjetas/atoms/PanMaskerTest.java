package com.banca.tarjetas.atoms;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class PanMaskerTest {

    @Test
    void givenValidPan_whenMask_thenOnlyLastFourVisible() {
        assertEquals("**** **** **** 1111", PanMasker.mask("4111111111111111"));
    }

    @Test
    void givenPanWithSpaces_whenMask_thenNormalized() {
        assertEquals("**** **** **** 0004", PanMasker.mask("5500 0000 0000 0004"));
    }

    @Test
    void givenInvalidPan_whenMask_thenThrows() {
        assertThrows(IllegalArgumentException.class, () -> PanMasker.mask("12ab"));
        assertThrows(IllegalArgumentException.class, () -> PanMasker.mask(null));
    }

    @Test
    void givenCardIds_whenValidate_thenFormatEnforced() {
        assertTrue(CardIdValidator.isValid("CARD-001"));
        assertFalse(CardIdValidator.isValid("card-1"));
        assertFalse(CardIdValidator.isValid("CARD-001; DROP"));
        assertFalse(CardIdValidator.isValid(null));
    }
}
