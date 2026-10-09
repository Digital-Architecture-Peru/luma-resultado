package com.banca.tarjetas;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.banca.tarjetas.api.ClienteInvalidoException;
import com.banca.tarjetas.api.ProblemMapper;
import com.banca.tarjetas.api.TarjetaResource;
import com.banca.tarjetas.api.dto.ProblemDetail;
import com.banca.tarjetas.api.dto.TarjetaDetalleDto;
import com.banca.tarjetas.api.dto.TarjetaResumenDto;
import com.banca.tarjetas.application.ConsultaTarjetasService;
import com.banca.tarjetas.application.TarjetaNoEncontradaException;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class TarjetaResourceTest {

    private static final String CLIENTE = RepositorioEnMemoria.CLIENTE.toString();

    private final TarjetaResource recurso =
            new TarjetaResource(new ConsultaTarjetasService(new RepositorioEnMemoria()));

    @Test
    void givenCabeceraValida_whenListar_thenMapeaMontosComoTexto() {
        List<TarjetaResumenDto> lista = recurso.listar(CLIENTE);
        assertEquals(2, lista.size());
        assertEquals("3250.75", lista.get(0).saldoDisponible());
        assertEquals("CREDITO", lista.get(0).tipo());
    }

    @Test
    void givenCabeceraAusente_whenListar_thenClienteInvalido() {
        assertThrows(ClienteInvalidoException.class, () -> recurso.listar(null));
        assertThrows(ClienteInvalidoException.class, () -> recurso.listar("  "));
    }

    @Test
    void givenCabeceraNoUuid_whenListar_thenClienteInvalido() {
        assertThrows(ClienteInvalidoException.class, () -> recurso.listar("abc"));
    }

    @Test
    void givenDebito_whenDetalle_thenLimiteNulo() {
        TarjetaDetalleDto d = recurso.detalle(CLIENTE, RepositorioEnMemoria.TARJETA_DEBITO.toString());
        assertNull(d.limiteCredito());
        assertEquals("1520.10", d.saldoDisponible());
    }

    @Test
    void givenCredito_whenDetalle_thenIncluyeLimite() {
        TarjetaDetalleDto d = recurso.detalle(CLIENTE, RepositorioEnMemoria.TARJETA_CREDITO.toString());
        assertEquals("5000.00", d.limiteCredito());
    }

    @Test
    void givenIdAjeno_whenDetalle_thenNoEncontrada() {
        assertThrows(TarjetaNoEncontradaException.class,
                () -> recurso.detalle(RepositorioEnMemoria.OTRO_CLIENTE.toString(),
                        RepositorioEnMemoria.TARJETA_CREDITO.toString()));
    }

    @Test
    void givenIdMalFormado_whenDetalle_thenIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> recurso.detalle(CLIENTE, "no-uuid"));
    }

    @Test
    void givenNoEncontrada_whenMapear_thenProblemJson404() {
        Response r = new ProblemMapper().noEncontrada(new TarjetaNoEncontradaException());
        assertEquals(404, r.getStatus());
        assertEquals(ProblemMapper.PROBLEM_JSON, r.getMediaType().toString());
        assertEquals(404, ((ProblemDetail) r.getEntity()).status());
    }

    @Test
    void givenClienteInvalido_whenMapear_thenProblemJson400() {
        Response r = new ProblemMapper().clienteInvalido(new ClienteInvalidoException("x"));
        assertEquals(400, r.getStatus());
    }

    @Test
    void givenError_whenMapear_thenNoExponeDetalleInterno() {
        Response r = new ProblemMapper().inesperado(new RuntimeException("secreto-interno " + UUID.randomUUID()));
        ProblemDetail p = (ProblemDetail) r.getEntity();
        assertEquals(500, r.getStatus());
        assertEquals("No se pudo procesar la solicitud", p.detail());
    }
}
