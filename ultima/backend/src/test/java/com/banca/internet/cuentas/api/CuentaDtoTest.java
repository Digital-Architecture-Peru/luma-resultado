package com.banca.internet.cuentas.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;

import com.banca.internet.cuentas.domain.Cuenta;

class CuentaDtoTest {

    @Test
    void givenNumeroLargo_whenEnmascarar_thenMuestraSoloUltimosCuatro() {
        assertEquals("****0011", CuentaDto.enmascarar("19100000000011"));
    }

    @Test
    void givenNumeroCortoONulo_whenEnmascarar_thenOcultaTodo() {
        assertEquals("****", CuentaDto.enmascarar("123"));
        assertEquals("****", CuentaDto.enmascarar(null));
    }

    @Test
    void givenCuenta_whenDesde_thenNoExponeNumeroCompleto() {
        Cuenta cuenta = new Cuenta(1L, 7L, "19100000000011", "AHORROS", "PEN",
                new BigDecimal("5.00"), "ACTIVA", LocalDate.of(2021, 3, 15));

        CuentaDto dto = CuentaDto.desde(cuenta);

        assertEquals("****0011", dto.numeroEnmascarado());
        assertEquals(new BigDecimal("5.00"), dto.saldoDisponible());
    }

    @Test
    void givenCabeceraValida_whenParsear_thenDevuelveId() {
        assertEquals(5L, ClienteIdHeader.parsear(" 5 "));
    }

    @Test
    void givenCabeceraInvalida_whenParsear_thenLanzaSolicitudInvalida() {
        assertThrows(SolicitudInvalidaException.class, () -> ClienteIdHeader.parsear(null));
        assertThrows(SolicitudInvalidaException.class, () -> ClienteIdHeader.parsear("abc"));
        assertThrows(SolicitudInvalidaException.class, () -> ClienteIdHeader.parsear("-3"));
    }
}
