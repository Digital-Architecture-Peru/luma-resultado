package com.banca.internet.tarjetas;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.banca.internet.tarjetas.atoms.CardStatus;
import com.banca.internet.tarjetas.atoms.InvalidRequestException;
import com.banca.internet.tarjetas.atoms.MaskedPan;
import org.junit.jupiter.api.Test;

class MaskedPanTest {

    @Test
    void givenLast4_whenDisplay_thenMasksRest() {
        assertEquals("**** **** **** 1234", new MaskedPan("1234").display());
    }

    @Test
    void givenFullPan_whenCreate_thenRejected() {
        assertThrows(IllegalArgumentException.class, () -> new MaskedPan("4111111111111111"));
    }

    @Test
    void givenLowercaseStatus_whenParse_thenReturnsEnum() {
        assertEquals(CardStatus.BLOCKED, CardStatus.parse("blocked").orElseThrow());
    }

    @Test
    void givenBlankStatus_whenParse_thenEmpty() {
        assertEquals(true, CardStatus.parse(" ").isEmpty());
    }

    @Test
    void givenUnknownStatus_whenParse_thenInvalidRequest() {
        assertThrows(InvalidRequestException.class, () -> CardStatus.parse("XYZ"));
    }
}
