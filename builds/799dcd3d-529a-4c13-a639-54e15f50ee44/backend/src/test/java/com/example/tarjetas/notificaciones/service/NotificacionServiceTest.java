package com.example.tarjetas.notificaciones.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.tarjetas.notificaciones.domain.Notificacion;
import com.example.tarjetas.notificaciones.domain.NotificacionNoEncontradaException;
import com.example.tarjetas.notificaciones.domain.Pagina;
import com.example.tarjetas.notificaciones.domain.TipoNotificacion;
import com.example.tarjetas.notificaciones.port.NotificacionRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NotificacionServiceTest {

    private NotificacionRepository repositorio;
    private NotificacionService servicio;

    @BeforeEach
    void preparar() {
        repositorio = mock(NotificacionRepository.class);
        servicio = new NotificacionService(repositorio);
    }

    private static Notificacion ejemplo(long id, boolean leida) {
        return new Notificacion(id, "tarjeta-0001", "1111", TipoNotificacion.CONSUMO,
                "Consumo ficticio", leida, OffsetDateTime.parse("2026-01-01T10:00:00Z"));
    }

    @Test
    void givenNotificaciones_whenListar_thenCalculaOffsetYDevuelvePagina() {
        when(repositorio.contar("tarjeta-0001", false)).thenReturn(45L);
        when(repositorio.buscar("tarjeta-0001", false, 40, 20))
                .thenReturn(List.of(ejemplo(1, false)));

        Pagina<Notificacion> pagina = servicio.listar("tarjeta-0001", false, 2, 20);

        assertEquals(45L, pagina.total());
        assertEquals(2, pagina.page());
        assertEquals(20, pagina.size());
        assertEquals(1, pagina.items().size());
    }

    @Test
    void givenSinResultados_whenListar_thenNoConsultaItems() {
        when(repositorio.contar("tarjeta-0009", null)).thenReturn(0L);

        Pagina<Notificacion> pagina = servicio.listar("tarjeta-0009", null, 0, 10);

        assertTrue(pagina.items().isEmpty());
        verify(repositorio, never()).buscar(anyString(), any(), anyInt(), anyInt());
    }

    @Test
    void givenTamanoFueraDeRango_whenListar_thenLanzaArgumentoInvalido() {
        assertThrows(IllegalArgumentException.class, () -> servicio.listar("tarjeta-0001", null, 0, 0));
        assertThrows(IllegalArgumentException.class, () -> servicio.listar("tarjeta-0001", null, 0, 101));
    }

    @Test
    void givenPaginaNegativaOTarjetaVacia_whenListar_thenLanzaArgumentoInvalido() {
        assertThrows(IllegalArgumentException.class, () -> servicio.listar("tarjeta-0001", null, -1, 10));
        assertThrows(IllegalArgumentException.class, () -> servicio.listar(" ", null, 0, 10));
    }

    @Test
    void givenIdExistente_whenMarcarLeida_thenDevuelveNotificacionLeida() {
        when(repositorio.marcarLeida(7L)).thenReturn(Optional.of(ejemplo(7, true)));

        Notificacion resultado = servicio.marcarLeida(7L);

        assertEquals(7L, resultado.id());
        assertTrue(resultado.leida());
        verify(repositorio).marcarLeida(eq(7L));
    }

    @Test
    void givenIdInexistente_whenMarcarLeida_thenLanzaNoEncontrada() {
        when(repositorio.marcarLeida(99L)).thenReturn(Optional.empty());

        assertThrows(NotificacionNoEncontradaException.class, () -> servicio.marcarLeida(99L));
        assertFalse(repositorio.marcarLeida(1L).isPresent());
    }
}
