package com.banco.pagos.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.banco.pagos.application.ConsultarPagoUseCase;
import com.banco.pagos.application.RegistrarPagoUseCase;
import com.banco.pagos.domain.PagoException;
import com.banco.pagos.infrastructure.PasarelaPagoStub;
import com.banco.pagos.support.InMemoryPagoRepository;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/** Prueba unitaria del recurso con dobles en memoria (sin levantar Quarkus ni base de datos). */
class PagoResourceTest {

    private PagoResource recurso;

    @BeforeEach
    void preparar() {
        InMemoryPagoRepository repo = new InMemoryPagoRepository();
        recurso = new PagoResource(
                new RegistrarPagoUseCase(repo, new PasarelaPagoStub()),
                new ConsultarPagoUseCase(repo));
    }

    private static PagoRequest solicitud(String destino, String monto) {
        return new PagoRequest("0000-FAKE-0001", destino, new BigDecimal(monto), "USD");
    }

    @Test
    void givenPagoNuevo_whenCrear_thenResponde201ConEstadoConfirmado() {
        Response respuesta = recurso.crear("k-1", solicitud("0000-FAKE-0002", "30.00"));

        assertEquals(201, respuesta.getStatus());
        PagoResponse cuerpo = (PagoResponse) respuesta.getEntity();
        assertEquals("CONFIRMADO", cuerpo.estado());
    }

    @Test
    void givenReintentoConMismaClave_whenCrear_thenResponde200ConElMismoPago() {
        PagoResponse primero = (PagoResponse) recurso.crear("k-2", solicitud("0000-FAKE-0002", "30.00")).getEntity();
        Response repetido = recurso.crear("k-2", solicitud("0000-FAKE-0002", "30.00"));

        assertEquals(200, repetido.getStatus());
        assertEquals(primero.id(), ((PagoResponse) repetido.getEntity()).id());
    }

    @Test
    void givenDestinoRechazadoPorStub_whenCrear_thenEstadoRechazado() {
        PagoResponse cuerpo = (PagoResponse) recurso.crear("k-3", solicitud("0000-FAKE-0000", "30.00")).getEntity();

        assertEquals("RECHAZADO", cuerpo.estado());
    }

    @Test
    void givenIdInexistente_whenObtener_thenNoEncontrado() {
        assertThrows(PagoException.NoEncontrado.class, () -> recurso.obtener(UUID.randomUUID()));
    }

    @Test
    void givenPagosDeUnaCuenta_whenListar_thenDevuelveSoloLosDeEsaCuenta() {
        recurso.crear("k-4", solicitud("0000-FAKE-0002", "10.00"));
        recurso.crear("k-5", solicitud("0000-FAKE-0003", "20.00"));

        List<PagoResponse> lista = recurso.listar("0000-FAKE-0001");

        assertEquals(2, lista.size());
        assertEquals(0, recurso.listar("0000-FAKE-9999").size());
    }

    @Test
    void givenErroresDeDominio_whenMapear_thenCodigosHttpEsperados() {
        ErrorMapper mapper = new ErrorMapper();

        assertEquals(404, mapper.toResponse(new PagoException.NoEncontrado("x")).getStatus());
        assertEquals(409, mapper.toResponse(new PagoException.ConflictoIdempotencia("x")).getStatus());
        assertEquals(422, mapper.toResponse(new PagoException.Invalido("x")).getStatus());
    }
}
