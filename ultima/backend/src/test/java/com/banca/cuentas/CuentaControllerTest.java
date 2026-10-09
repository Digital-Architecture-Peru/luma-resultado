package com.banca.cuentas;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banca.cuentas.api.CuentaController;
import com.banca.cuentas.service.CuentaNoEncontradaException;
import com.banca.cuentas.service.CuentaService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import com.banca.cuentas.api.ApiExceptionHandler;

@WebMvcTest(CuentaController.class)
@Import(ApiExceptionHandler.class)
class CuentaControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private CuentaService servicio;

    @Test
    void givenCliente_whenListar_thenRespondeResumenesConNumeroEnmascarado() throws Exception {
        UUID id = UUID.randomUUID();
        when(servicio.listarPorCliente("CLI-001")).thenReturn(List.of(CuentaServiceTest.cuentaEjemplo(id)));

        mvc.perform(get("/api/v1/cuentas").param("clienteId", "CLI-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(id.toString()))
                .andExpect(jsonPath("$[0].numeroEnmascarado").value("****2345"))
                .andExpect(jsonPath("$[0].numero").doesNotExist())
                .andExpect(jsonPath("$[0].moneda").value("PEN"));
    }

    @Test
    void givenSinClienteId_whenListar_thenResponde400() throws Exception {
        mvc.perform(get("/api/v1/cuentas")).andExpect(status().isBadRequest());
    }

    @Test
    void givenClienteInvalido_whenListar_thenResponde400() throws Exception {
        when(servicio.listarPorCliente("***")).thenThrow(new IllegalArgumentException("clienteId invalido"));

        mvc.perform(get("/api/v1/cuentas").param("clienteId", "***"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void givenCuentaInexistente_whenDetalle_thenResponde404() throws Exception {
        UUID id = UUID.randomUUID();
        when(servicio.obtener(id)).thenThrow(new CuentaNoEncontradaException(id));

        mvc.perform(get("/api/v1/cuentas/" + id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void givenIdNoUuid_whenDetalle_thenResponde400() throws Exception {
        mvc.perform(get("/api/v1/cuentas/abc")).andExpect(status().isBadRequest());
    }

    @Test
    void givenCuentaExistente_whenDetalle_thenIncluyeSaldoContable() throws Exception {
        UUID id = UUID.randomUUID();
        when(servicio.obtener(id)).thenReturn(CuentaServiceTest.cuentaEjemplo(id));

        mvc.perform(get("/api/v1/cuentas/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.saldoContable").value(120.00))
                .andExpect(jsonPath("$.estado").value("ACTIVA"));
    }
}
