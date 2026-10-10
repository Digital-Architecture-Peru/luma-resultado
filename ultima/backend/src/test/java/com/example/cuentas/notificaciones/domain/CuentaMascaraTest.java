package com.example.cuentas.notificaciones.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class CuentaMascaraTest {

    @Test
    void givenCuentaLarga_whenEnmascarar_thenMuestraUltimosCuatroDigitos() {
        assertEquals("****3344", CuentaMascara.enmascarar("0011223344"));
    }

    @Test
    void givenCuentaCortaONula_whenEnmascarar_thenOcultaTodo() {
        assertEquals("****", CuentaMascara.enmascarar("123"));
        assertEquals("****", CuentaMascara.enmascarar(null));
    }
}
