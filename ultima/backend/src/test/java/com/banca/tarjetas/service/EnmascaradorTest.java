package com.banca.tarjetas.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class EnmascaradorTest {

    @Test
    void givenUltimos4Validos_whenEnmascarar_thenAnteponeAsteriscos() {
        assertEquals("**** 1234", Enmascarador.enmascarar("1234"));
    }

    @Test
    void givenNulo_whenEnmascarar_thenLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> Enmascarador.enmascarar(null));
    }

    @Test
    void givenLongitudIncorrecta_whenEnmascarar_thenLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> Enmascarador.enmascarar("12345"));
    }

    @Test
    void givenCaracteresNoNumericos_whenEnmascarar_thenLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> Enmascarador.enmascarar("12ab"));
    }
}
