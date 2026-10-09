package com.banco.pagos.domain;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class ReglasPagoTest {

    private static final String ORIGEN = "0000-FAKE-0001";
    private static final String DESTINO = "0000-FAKE-0002";

    @Test
    void givenDatosValidos_whenValidar_thenNoLanzaError() {
        assertDoesNotThrow(() -> ReglasPago.validar(ORIGEN, DESTINO, new BigDecimal("10.50"), "USD"));
    }

    @Test
    void givenMismaCuenta_whenValidar_thenInvalido() {
        PagoException.Invalido error = assertThrows(PagoException.Invalido.class,
                () -> ReglasPago.validar(ORIGEN, ORIGEN, BigDecimal.TEN, "USD"));
        assertTrue(error.getMessage().contains("distintas"));
    }

    @Test
    void givenMontoCeroONegativo_whenValidar_thenInvalido() {
        assertThrows(PagoException.Invalido.class, () -> ReglasPago.validar(ORIGEN, DESTINO, BigDecimal.ZERO, "USD"));
        assertThrows(PagoException.Invalido.class, () -> ReglasPago.validar(ORIGEN, DESTINO, new BigDecimal("-1"), "USD"));
    }

    @Test
    void givenMontoConTresDecimales_whenValidar_thenInvalido() {
        assertThrows(PagoException.Invalido.class,
                () -> ReglasPago.validar(ORIGEN, DESTINO, new BigDecimal("1.001"), "USD"));
    }

    @Test
    void givenMontoSobreMaximo_whenValidar_thenInvalido() {
        assertThrows(PagoException.Invalido.class,
                () -> ReglasPago.validar(ORIGEN, DESTINO, new BigDecimal("1000000.01"), "USD"));
    }

    @Test
    void givenMonedaMinusculaOCuentaCorta_whenValidar_thenInvalido() {
        assertThrows(PagoException.Invalido.class, () -> ReglasPago.validar(ORIGEN, DESTINO, BigDecimal.TEN, "usd"));
        assertThrows(PagoException.Invalido.class, () -> ReglasPago.validar("AB", DESTINO, BigDecimal.TEN, "USD"));
        assertThrows(PagoException.Invalido.class, () -> ReglasPago.validar(null, DESTINO, BigDecimal.TEN, "USD"));
    }

    @Test
    void givenPagoPendiente_whenConfirmar_thenEstadoFinalYNoTransicionaDeNuevo() {
        Pago pago = Pago.nuevo("k-1", ORIGEN, DESTINO, BigDecimal.TEN, "USD");
        assertEquals(EstadoPago.PENDIENTE, pago.getEstado());
        pago.confirmar();
        assertEquals(EstadoPago.CONFIRMADO, pago.getEstado());
        assertThrows(IllegalStateException.class, pago::rechazar);
    }
}
