package com.banco.pagos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.banco.pagos.application.PagoNoEncontradoException;
import com.banco.pagos.application.PagoService;
import com.banco.pagos.application.SolicitudInvalidaException;
import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.PaginaResultado;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.PagoFiltro;
import com.banco.pagos.domain.PagoRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class PagoServiceTest {

    private static final String CUENTA = "CTA-0001";

    private PagoRepository repositorio;
    private PagoService servicio;

    @BeforeEach
    void preparar() {
        repositorio = mock(PagoRepository.class);
        servicio = new PagoService(repositorio);
    }

    @Test
    void givenRangoDeFechas_whenConsultar_thenFiltroUsaInicioDeDiaYHastaExclusivo() {
        when(repositorio.buscar(eq(CUENTA), any(), anyInt(), anyInt()))
                .thenReturn(new PaginaResultado<>(List.of(), 0, 20, 0));

        servicio.consultar(CUENTA, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30), EstadoPago.PROCESADO, 0, 20);

        ArgumentCaptor<PagoFiltro> captor = ArgumentCaptor.forClass(PagoFiltro.class);
        verify(repositorio).buscar(eq(CUENTA), captor.capture(), eq(0), eq(20));
        assertEquals(OffsetDateTime.of(2026, 9, 1, 0, 0, 0, 0, ZoneOffset.UTC), captor.getValue().desde());
        assertEquals(OffsetDateTime.of(2026, 10, 1, 0, 0, 0, 0, ZoneOffset.UTC), captor.getValue().hastaExclusivo());
        assertEquals(EstadoPago.PROCESADO, captor.getValue().estado());
    }

    @Test
    void givenSinFiltros_whenConsultar_thenFiltroVacio() {
        when(repositorio.buscar(eq(CUENTA), any(), anyInt(), anyInt()))
                .thenReturn(new PaginaResultado<>(List.of(), 0, 20, 0));

        servicio.consultar(CUENTA, null, null, null, 0, 20);

        ArgumentCaptor<PagoFiltro> captor = ArgumentCaptor.forClass(PagoFiltro.class);
        verify(repositorio).buscar(eq(CUENTA), captor.capture(), eq(0), eq(20));
        assertEquals(new PagoFiltro(null, null, null), captor.getValue());
    }

    @Test
    void givenDesdePosteriorAHasta_whenConsultar_thenSolicitudInvalida() {
        assertThrows(SolicitudInvalidaException.class, () -> servicio.consultar(
                CUENTA, LocalDate.of(2026, 10, 2), LocalDate.of(2026, 10, 1), null, 0, 20));
        verify(repositorio, never()).buscar(any(), any(), anyInt(), anyInt());
    }

    @Test
    void givenTamanoFueraDeRango_whenConsultar_thenSolicitudInvalida() {
        assertThrows(SolicitudInvalidaException.class,
                () -> servicio.consultar(CUENTA, null, null, null, 0, 0));
        assertThrows(SolicitudInvalidaException.class,
                () -> servicio.consultar(CUENTA, null, null, null, 0, PagoService.TAMANO_MAXIMO + 1));
        assertThrows(SolicitudInvalidaException.class,
                () -> servicio.consultar(CUENTA, null, null, null, -1, 20));
    }

    @Test
    void givenPagoDeLaCuenta_whenObtener_thenLoDevuelve() {
        Pago pago = pagoEjemplo();
        when(repositorio.buscarPorId(CUENTA, 1L)).thenReturn(Optional.of(pago));

        assertEquals(pago, servicio.obtener(CUENTA, 1L));
    }

    @Test
    void givenPagoAjenoOInexistente_whenObtener_thenNoEncontrado() {
        when(repositorio.buscarPorId(CUENTA, 99L)).thenReturn(Optional.empty());

        assertThrows(PagoNoEncontradoException.class, () -> servicio.obtener(CUENTA, 99L));
    }

    static Pago pagoEjemplo() {
        return new Pago(1L, CUENTA, "001200451234", "Empresa Eléctrica Demo", "Servicio de luz",
                new BigDecimal("85.40"), "USD", EstadoPago.PROCESADO,
                OffsetDateTime.of(2026, 9, 2, 10, 15, 0, 0, ZoneOffset.UTC));
    }
}
