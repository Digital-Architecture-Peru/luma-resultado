package com.demo.tarjetas.transaccion.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class TransaccionTest {

    @Test
    void givenDatosValidos_whenCrear_thenQuedaPendiente() {
        Transaccion t = Transaccion.nueva(1L, new BigDecimal("10.50"), "USD", "k-1");
        assertEquals(EstadoTransaccion.PENDIENTE, t.estado());
    }

    @Test
    void givenMontoCero_whenCrear_thenReglaNegocio() {
        assertThrows(ReglaNegocioException.class,
                () -> Transaccion.nueva(1L, BigDecimal.ZERO, "USD", "k-1"));
    }

    @Test
    void givenTresDecimales_whenCrear_thenReglaNegocio() {
        assertThrows(ReglaNegocioException.class,
                () -> Transaccion.nueva(1L, new BigDecimal("1.001"), "USD", "k-1"));
    }

    @Test
    void givenMontoSobreMaximo_whenCrear_thenReglaNegocio() {
        assertThrows(ReglaNegocioException.class,
                () -> Transaccion.nueva(1L, new BigDecimal("1000000.01"), "USD", "k-1"));
    }

    @Test
    void givenMonedaInvalida_whenCrear_thenReglaNegocio() {
        assertThrows(ReglaNegocioException.class,
                () -> Transaccion.nueva(1L, BigDecimal.TEN, "usd", "k-1"));
        assertThrows(ReglaNegocioException.class,
                () -> Transaccion.nueva(1L, BigDecimal.TEN, "JPY", "k-1"));
    }

    @Test
    void givenClaveVacia_whenCrear_thenReglaNegocio() {
        assertThrows(ReglaNegocioException.class,
                () -> Transaccion.nueva(1L, BigDecimal.TEN, "USD", " "));
    }

    @Test
    void givenTransaccion_whenConEstado_thenConservaIdentidad() {
        Transaccion t = Transaccion.nueva(1L, BigDecimal.TEN, "EUR", "k-2");
        Transaccion aprobada = t.conEstado(EstadoTransaccion.APROBADA);
        assertEquals(t.id(), aprobada.id());
        assertEquals(EstadoTransaccion.APROBADA, aprobada.estado());
    }
}
