package com.example.cuentas.notificaciones.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.cuentas.notificaciones.domain.Canal;
import com.example.cuentas.notificaciones.domain.Notificacion;
import com.example.cuentas.notificaciones.domain.Pagina;
import com.example.cuentas.notificaciones.domain.Preferencia;
import com.example.cuentas.notificaciones.domain.TipoEvento;
import com.example.cuentas.notificaciones.port.CanalNotificacionPort;
import com.example.cuentas.notificaciones.port.NotificacionRepository;
import com.example.cuentas.notificaciones.port.PreferenciaRepository;
import com.example.cuentas.notificaciones.port.TitularidadPort;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NotificacionServiceTest {

    private static final String CUENTA = "0011223344";

    private NotificacionRepository notificaciones;
    private PreferenciaRepository preferencias;
    private CanalNotificacionPort canal;
    private TitularidadPort titularidad;
    private NotificacionService servicio;

    @BeforeEach
    void preparar() {
        notificaciones = mock(NotificacionRepository.class);
        preferencias = mock(PreferenciaRepository.class);
        canal = mock(CanalNotificacionPort.class);
        titularidad = mock(TitularidadPort.class);
        when(titularidad.esTitular(CUENTA)).thenReturn(true);
        servicio = new NotificacionService(notificaciones, preferencias, canal, titularidad);
    }

    private Notificacion ejemplo(boolean leida) {
        return new Notificacion(UUID.randomUUID(), CUENTA, TipoEvento.ABONO, "Abono recibido",
                new BigDecimal("10.00"), leida, Instant.now());
    }

    @Test
    void givenCuentaTitular_whenListar_thenDelegaEnRepositorio() {
        Pagina<Notificacion> esperada = new Pagina<>(List.of(ejemplo(false)), 0, 20, 1);
        when(notificaciones.buscar(CUENTA, false, 0, 20)).thenReturn(esperada);

        assertEquals(esperada, servicio.listar(CUENTA, false, 0, 20));
    }

    @Test
    void givenCuentaAjena_whenListar_thenLanzaNoAutorizada() {
        when(titularidad.esTitular("9999999999")).thenReturn(false);

        assertThrows(CuentaNoAutorizadaException.class, () -> servicio.listar("9999999999", null, 0, 20));
        verify(notificaciones, never()).buscar(any(), any(), org.mockito.ArgumentMatchers.anyInt(),
                org.mockito.ArgumentMatchers.anyInt());
    }

    @Test
    void givenPaginacionInvalida_whenListar_thenLanzaArgumentoInvalido() {
        assertThrows(IllegalArgumentException.class, () -> servicio.listar(CUENTA, null, -1, 20));
        assertThrows(IllegalArgumentException.class, () -> servicio.listar(CUENTA, null, 0, 0));
        assertThrows(IllegalArgumentException.class, () -> servicio.listar(CUENTA, null, 0, 101));
    }

    @Test
    void givenNotificacionNoLeida_whenMarcarLeida_thenPersisteYDevuelveLeida() {
        Notificacion n = ejemplo(false);
        when(notificaciones.buscarPorId(n.id())).thenReturn(Optional.of(n));

        Notificacion resultado = servicio.marcarLeida(n.id());

        assertTrue(resultado.leida());
        verify(notificaciones).marcarLeida(n.id());
    }

    @Test
    void givenNotificacionYaLeida_whenMarcarLeida_thenNoEscribe() {
        Notificacion n = ejemplo(true);
        when(notificaciones.buscarPorId(n.id())).thenReturn(Optional.of(n));

        servicio.marcarLeida(n.id());

        verify(notificaciones, never()).marcarLeida(n.id());
    }

    @Test
    void givenIdInexistente_whenMarcarLeida_thenLanzaNoEncontrado() {
        UUID id = UUID.randomUUID();
        when(notificaciones.buscarPorId(id)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> servicio.marcarLeida(id));
    }

    @Test
    void givenPreferenciasMixtas_whenRegistrar_thenEnviaSoloPorCanalesQueAplican() {
        when(preferencias.listar(CUENTA)).thenReturn(List.of(
                new Preferencia(CUENTA, TipoEvento.CARGO, Canal.APP, true, new BigDecimal("50.00")),
                new Preferencia(CUENTA, TipoEvento.CARGO, Canal.SMS, true, new BigDecimal("200.00")),
                new Preferencia(CUENTA, TipoEvento.CARGO, Canal.EMAIL, false, null),
                new Preferencia(CUENTA, TipoEvento.ABONO, Canal.APP, true, null)));

        Notificacion n = servicio.registrar(CUENTA, TipoEvento.CARGO, "Cargo por compra", new BigDecimal("89.90"));

        verify(notificaciones).guardar(n);
        verify(canal, times(1)).enviar(n, Canal.APP);
        verify(canal, never()).enviar(n, Canal.SMS);
        verify(canal, never()).enviar(n, Canal.EMAIL);
        assertFalse(n.leida());
    }

    @Test
    void givenMensajeVacio_whenRegistrar_thenLanzaArgumentoInvalido() {
        assertThrows(IllegalArgumentException.class,
                () -> servicio.registrar(CUENTA, TipoEvento.ABONO, "  ", BigDecimal.ONE));
    }
}
