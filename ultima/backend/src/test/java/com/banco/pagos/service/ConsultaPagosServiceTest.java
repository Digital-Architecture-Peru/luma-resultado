package com.banco.pagos.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.banco.pagos.api.PagoDto;
import com.banco.pagos.api.PaginaDto;
import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.FiltroPagos;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.repository.PagoRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class ConsultaPagosServiceTest {

    private static final String CUENTA = "0012345678901234";

    private PagoRepository repositorio;
    private ConsultaPagosService servicio;

    @BeforeEach
    void preparar() {
        repositorio = mock(PagoRepository.class);
        servicio = new ConsultaPagosService(repositorio);
    }

    private static Pago pago(long id, String cuenta) {
        Pago p = new Pago();
        p.id = id;
        p.cuentaId = cuenta;
        p.beneficiario = "Empresa Demo";
        p.concepto = "Recibo";
        p.monto = new BigDecimal("10.50");
        p.moneda = "USD";
        p.estado = EstadoPago.PROCESADO;
        p.fechaPago = Instant.parse("2026-10-01T10:00:00Z");
        return p;
    }

    @Test
    void givenFiltros_whenConsultar_thenTraduceAFiltroYPagina() {
        when(repositorio.buscar(any(), eq(1), eq(2))).thenReturn(List.of(pago(1, CUENTA), pago(2, CUENTA)));
        when(repositorio.contar(any())).thenReturn(5L);

        PaginaDto<PagoDto> pagina = servicio.consultar(new ConsultaPagos(
                CUENTA, "2026-10-01T00:00:00Z", "2026-10-31T23:59:59Z", "procesado", 1, 2));

        ArgumentCaptor<FiltroPagos> captor = ArgumentCaptor.forClass(FiltroPagos.class);
        verify(repositorio).buscar(captor.capture(), eq(1), eq(2));
        assertEquals(EstadoPago.PROCESADO, captor.getValue().estado());
        assertEquals(Instant.parse("2026-10-01T00:00:00Z"), captor.getValue().desde());
        assertEquals(2, pagina.contenido().size());
        assertEquals(5L, pagina.total());
        assertEquals(3, pagina.totalPaginas());
        assertEquals("****1234", pagina.contenido().get(0).cuentaEnmascarada());
    }

    @Test
    void givenSinFiltrosOpcionales_whenConsultar_thenFiltroLosDejaNulos() {
        when(repositorio.buscar(any(), eq(0), eq(20))).thenReturn(List.of());
        when(repositorio.contar(any())).thenReturn(0L);

        PaginaDto<PagoDto> pagina = servicio.consultar(new ConsultaPagos(CUENTA, null, " ", null, 0, 20));

        ArgumentCaptor<FiltroPagos> captor = ArgumentCaptor.forClass(FiltroPagos.class);
        verify(repositorio).buscar(captor.capture(), eq(0), eq(20));
        assertEquals(null, captor.getValue().desde());
        assertEquals(null, captor.getValue().hasta());
        assertEquals(null, captor.getValue().estado());
        assertEquals(0, pagina.totalPaginas());
    }

    @Test
    void givenCuentaVacia_whenConsultar_thenParametroInvalido() {
        ConsultaException e = assertThrows(ConsultaException.class,
                () -> servicio.consultar(new ConsultaPagos(" ", null, null, null, 0, 20)));
        assertEquals(400, e.status());
        verifyNoInteractions(repositorio);
    }

    @Test
    void givenSizeFueraDeRango_whenConsultar_thenParametroInvalido() {
        assertEquals(400, assertThrows(ConsultaException.class,
                () -> servicio.consultar(new ConsultaPagos(CUENTA, null, null, null, 0, 101))).status());
        assertEquals(400, assertThrows(ConsultaException.class,
                () -> servicio.consultar(new ConsultaPagos(CUENTA, null, null, null, 0, 0))).status());
        assertEquals(400, assertThrows(ConsultaException.class,
                () -> servicio.consultar(new ConsultaPagos(CUENTA, null, null, null, -1, 10))).status());
    }

    @Test
    void givenFechaMalFormada_whenConsultar_thenParametroInvalido() {
        ConsultaException e = assertThrows(ConsultaException.class,
                () -> servicio.consultar(new ConsultaPagos(CUENTA, "ayer", null, null, 0, 10)));
        assertEquals(400, e.status());
    }

    @Test
    void givenRangoInvertido_whenConsultar_thenParametroInvalido() {
        assertThrows(ConsultaException.class, () -> servicio.consultar(new ConsultaPagos(
                CUENTA, "2026-10-31T00:00:00Z", "2026-10-01T00:00:00Z", null, 0, 10)));
    }

    @Test
    void givenEstadoDesconocido_whenConsultar_thenParametroInvalido() {
        assertThrows(ConsultaException.class,
                () -> servicio.consultar(new ConsultaPagos(CUENTA, null, null, "XYZ", 0, 10)));
    }

    @Test
    void givenPagoDeLaCuenta_whenObtener_thenDevuelveDto() {
        when(repositorio.porId(7L)).thenReturn(Optional.of(pago(7, CUENTA)));
        assertEquals(7L, servicio.obtener(7L, CUENTA).id());
    }

    @Test
    void givenPagoDeOtraCuenta_whenObtener_thenNoEncontrado() {
        when(repositorio.porId(7L)).thenReturn(Optional.of(pago(7, "0098765432109876")));
        ConsultaException e = assertThrows(ConsultaException.class, () -> servicio.obtener(7L, CUENTA));
        assertEquals(404, e.status());
    }

    @Test
    void givenPagoInexistente_whenObtener_thenNoEncontrado() {
        when(repositorio.porId(99L)).thenReturn(Optional.empty());
        assertEquals(404, assertThrows(ConsultaException.class, () -> servicio.obtener(99L, CUENTA)).status());
    }
}
