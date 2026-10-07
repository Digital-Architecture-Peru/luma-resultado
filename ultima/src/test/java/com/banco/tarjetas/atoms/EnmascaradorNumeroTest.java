package com.banco.tarjetas.atoms;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class EnmascaradorNumeroTest {

    @Test
    void givenNumero16Digitos_whenEnmascarar_thenSoloUltimos4Visibles() {
        assertEquals("************1111", EnmascaradorNumero.enmascarar("4000000000001111"));
    }

    @Test
    void givenNumeroConLetras_whenEnmascarar_thenLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> EnmascaradorNumero.enmascarar("40000000000011AB"));
    }

    @Test
    void givenNumeroCorto_whenEnmascarar_thenLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> EnmascaradorNumero.enmascarar("1234"));
    }

    @Test
    void givenNull_whenEnmascarar_thenLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> EnmascaradorNumero.enmascarar(null));
    }
}
