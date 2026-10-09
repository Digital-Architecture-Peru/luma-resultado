package com.banco.pagos.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.FiltroPagos;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.Pagina;
import com.banco.pagos.repository.PagoRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class PagoServiceTest {

    private PagoRepository repository;
    private PagoService service;

    @BeforeEach
    void setUp() {
        repository = mock(PagoRepository.class);
        service = new PagoService(repository);
    }

    private Pago pagoEjemplo(UUID id) {
        return new Pago(id, "CLI-0001", "****-0123", "Demo", new BigDecimal("10.00"), "USD",
                EstadoPago.PROCESADO, OffsetDateTime.parse("2026-09-01T10:00:00Z"));
    }

    @Test
    void givenFechas_whenListar_thenConvierteHastaAFinExclusivoUtc() {
        when(repository.listar(any(), eq(0), eq(20))).thenReturn(Pagina.de(List.of(), 0, 20, 0));

        service.listar("CLI-0001", EstadoPago.PENDIENTE, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30), 0, 20);

        ArgumentCaptor<FiltroPagos> captor = ArgumentCaptor.forClass(FiltroPagos.class);
        verify(repository).listar(captor.capture(), eq(0), eq(20));
        FiltroPagos filtro = captor.getValue();
        assertEquals("CLI-0001", filtro.clienteId());
        assertEquals(EstadoPago.PENDIENTE, filtro.estado());
        assertEquals(OffsetDateTime.of(2026, 9, 1, 0, 0, 0, 0, ZoneOffset.UTC), filtro.desde());
        assertEquals(OffsetDateTime.of(2026, 10, 1, 0, 0, 0, 0, ZoneOffset.UTC), filtro.hasta());
    }

    @Test
    void givenSinFechas_whenListar_thenFiltrosNulos() {
        when(repository.listar(any(), eq(1), eq(5))).thenReturn(Pagina.de(List.of(), 1, 5, 0));

        service.listar("CLI-0001", null, null, null, 1, 5);

        ArgumentCaptor<FiltroPagos> captor = ArgumentCaptor.forClass(FiltroPagos.class);
        verify(repository).listar(captor.capture(), eq(1), eq(5));
        assertEquals(null, captor.getValue().desde());
        assertEquals(null, captor.getValue().hasta());
    }

    @Test
    void givenSizeFueraDeRango_whenListar_thenLanzaIllegalArgument() {
        assertThrows(IllegalArgumentException.class,
                () -> service.listar("CLI-0001", null, null, null, 0, PagoService.TAMANO_MAXIMO + 1));
        assertThrows(IllegalArgumentException.class,
                () -> service.listar("CLI-0001", null, null, null, 0, 0));
        verify(repository, never()).listar(any(), eq(0), eq(0));
    }

    @Test
    void givenPaginaNegativa_whenListar_thenLanzaIllegalArgument() {
        assertThrows(IllegalArgumentException.class,
                () -> service.listar("CLI-0001", null, null, null, -1, 20));
    }

    @Test
    void givenDesdePosteriorAHasta_whenListar_thenLanzaIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> service.listar("CLI-0001", null,
                LocalDate.of(2026, 10, 2), LocalDate.of(2026, 10, 1), 0, 20));
    }

    @Test
    void givenClienteVacio_whenListar_thenLanzaIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> service.listar(" ", null, null, null, 0, 20));
        assertThrows(IllegalArgumentException.class, () -> service.listar(null, null, null, null, 0, 20));
    }

    @Test
    void givenPagoExistente_whenObtener_thenLoDevuelve() {
        UUID id = UUID.randomUUID();
        Pago pago = pagoEjemplo(id);
        when(repository.buscarPorId("CLI-0001", id)).thenReturn(Optional.of(pago));

        assertEquals(pago, service.obtener("CLI-0001", id));
    }

    @Test
    void givenPagoInexistente_whenObtener_thenLanzaNoEncontrado() {
        UUID id = UUID.randomUUID();
        when(repository.buscarPorId("CLI-0001", id)).thenReturn(Optional.empty());

        assertThrows(PagoNoEncontradoException.class, () -> service.obtener("CLI-0001", id));
    }
}
