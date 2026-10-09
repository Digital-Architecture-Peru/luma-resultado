package com.banco.pagos.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.Pagina;
import com.banco.pagos.service.PagoNoEncontradoException;
import com.banco.pagos.service.PagoService;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class PagoControllerTest {

    private static final String CLIENTE = "CLI-0001";

    private PagoService service;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        service = mock(PagoService.class);
        mvc = MockMvcBuilders.standaloneSetup(new PagoController(service))
                .setControllerAdvice(new ApiExceptionHandler())
                .build();
    }

    private Pago pago(UUID id) {
        return new Pago(id, CLIENTE, "****-0123", "Agua Demo", new BigDecimal("32.10"), "USD",
                EstadoPago.PROCESADO, OffsetDateTime.parse("2026-09-03T09:00:00Z"));
    }

    @Test
    void givenPagos_whenGetListado_thenDevuelve200ConContenidoSinClienteId() throws Exception {
        UUID id = UUID.randomUUID();
        when(service.listar(eq(CLIENTE), eq(EstadoPago.PROCESADO), any(), any(), eq(0), eq(20)))
                .thenReturn(Pagina.de(List.of(pago(id)), 0, 20, 1));

        mvc.perform(get("/api/v1/pagos").header("X-Cliente-Id", CLIENTE).param("estado", "PROCESADO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contenido[0].id").value(id.toString()))
                .andExpect(jsonPath("$.contenido[0].beneficiario").value("Agua Demo"))
                .andExpect(jsonPath("$.contenido[0].clienteId").doesNotExist())
                .andExpect(jsonPath("$.totalElementos").value(1));
    }

    @Test
    void givenSinHeaderCliente_whenGetListado_thenDevuelve400() throws Exception {
        mvc.perform(get("/api/v1/pagos"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Solicitud inválida"));
    }

    @Test
    void givenEstadoInvalido_whenGetListado_thenDevuelve400() throws Exception {
        mvc.perform(get("/api/v1/pagos").header("X-Cliente-Id", CLIENTE).param("estado", "XYZ"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenServicioRechazaParametros_whenGetListado_thenDevuelve400() throws Exception {
        when(service.listar(eq(CLIENTE), any(), any(), any(), eq(0), eq(500)))
                .thenThrow(new IllegalArgumentException("size debe estar entre 1 y 100"));

        mvc.perform(get("/api/v1/pagos").header("X-Cliente-Id", CLIENTE).param("size", "500"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("size debe estar entre 1 y 100"));
    }

    @Test
    void givenPagoExistente_whenGetPorId_thenDevuelve200() throws Exception {
        UUID id = UUID.randomUUID();
        when(service.obtener(CLIENTE, id)).thenReturn(pago(id));

        mvc.perform(get("/api/v1/pagos/" + id).header("X-Cliente-Id", CLIENTE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("PROCESADO"));
    }

    @Test
    void givenPagoInexistente_whenGetPorId_thenDevuelve404() throws Exception {
        UUID id = UUID.randomUUID();
        when(service.obtener(CLIENTE, id)).thenThrow(new PagoNoEncontradoException(id));

        mvc.perform(get("/api/v1/pagos/" + id).header("X-Cliente-Id", CLIENTE))
                .andExpect(status().isNotFound());
    }
}
