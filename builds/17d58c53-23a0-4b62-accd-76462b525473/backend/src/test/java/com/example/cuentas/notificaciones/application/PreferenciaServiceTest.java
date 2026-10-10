package com.example.cuentas.notificaciones.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.cuentas.notificaciones.domain.Canal;
import com.example.cuentas.notificaciones.domain.Preferencia;
import com.example.cuentas.notificaciones.domain.TipoEvento;
import com.example.cuentas.notificaciones.port.PreferenciaRepository;
import com.example.cuentas.notificaciones.port.TitularidadPort;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PreferenciaServiceTest {

    private static final String CUENTA = "0011223344";

    private PreferenciaRepository repositorio;
    private TitularidadPort titularidad;
    private PreferenciaService servicio;

    @BeforeEach
    void preparar() {
        repositorio = mock(PreferenciaRepository.class);
        titularidad = mock(TitularidadPort.class);
        when(titularidad.esTitular(CUENTA)).thenReturn(true);
        servicio = new PreferenciaService(repositorio, titularidad);
    }

    @Test
    void givenCuentaTitular_whenListar_thenDevuelvePreferencias() {
        List<Preferencia> esperadas = List.of(new Preferencia(CUENTA, TipoEvento.ABONO, Canal.APP, true, null));
        when(repositorio.listar(CUENTA)).thenReturn(esperadas);

        assertEquals(esperadas, servicio.listar(CUENTA));
    }

    @Test
    void givenPreferenciaValida_whenActualizar_thenGuarda() {
        Preferencia p = new Preferencia(CUENTA, TipoEvento.CARGO, Canal.SMS, true, new BigDecimal("75.00"));

        assertEquals(p, servicio.actualizar(p));
        verify(repositorio).guardar(p);
    }

    @Test
    void givenCuentaAjena_whenActualizar_thenNoGuarda() {
        Preferencia p = new Preferencia("9999999999", TipoEvento.CARGO, Canal.SMS, true, null);
        when(titularidad.esTitular("9999999999")).thenReturn(false);

        assertThrows(CuentaNoAutorizadaException.class, () -> servicio.actualizar(p));
        verify(repositorio, never()).guardar(p);
    }

    @Test
    void givenUmbralNegativo_whenCrearPreferencia_thenLanzaArgumentoInvalido() {
        assertThrows(IllegalArgumentException.class,
                () -> new Preferencia(CUENTA, TipoEvento.CARGO, Canal.APP, true, new BigDecimal("-1")));
    }
}
