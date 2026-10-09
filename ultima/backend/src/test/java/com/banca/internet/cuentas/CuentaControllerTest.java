package com.banca.internet.cuentas;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banca.internet.cuentas.api.CuentaController;
import com.banca.internet.cuentas.domain.EstadoCuenta;
import com.banca.internet.cuentas.domain.TipoCuenta;
import com.banca.internet.cuentas.dto.CuentaDto;
import com.banca.internet.cuentas.dto.PaginaCuentasDto;
import com.banca.internet.cuentas.service.CuentaNoEncontradaException;
import com.banca.internet.cuentas.service.CuentaService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CuentaController.class)
class CuentaControllerTest {

    private static final UUID ID = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final String CABECERA = "X-Cliente-Id";

    @Autowired
    private MockMvc mvc;

    @MockBean
    private CuentaService service;

    private CuentaDto dto() {
        return new CuentaDto(ID, "****2345", TipoCuenta.AHORRO, "PEN", new BigDecimal("2540.75"),
                EstadoCuenta.ACTIVA, LocalDate.of(2021, 3, 15));
    }

    @Test
    void givenCliente_whenListar_thenDevuelve200ConNumeroEnmascarado() throws Exception {
        when(service.listar("CLI-0001", 0, 20))
                .thenReturn(new PaginaCuentasDto(List.of(dto()), 0, 20, 1, 1));

        mvc.perform(get("/api/v1/cuentas").header(CABECERA, "CLI-0001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contenido[0].numeroEnmascarado").value("****2345"))
                .andExpect(jsonPath("$.totalElementos").value(1));
    }

    @Test
    void givenSinCabecera_whenListar_thenDevuelve400() throws Exception {
        mvc.perform(get("/api/v1/cuentas")).andExpect(status().isBadRequest());
    }

    @Test
    void givenTamanioExcesivo_whenListar_thenDevuelve400() throws Exception {
        mvc.perform(get("/api/v1/cuentas?tamanio=1000").header(CABECERA, "CLI-0001"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenCuentaInexistente_whenObtener_thenDevuelve404ProblemDetail() throws Exception {
        when(service.obtener(eq("CLI-0001"), any(UUID.class))).thenThrow(new CuentaNoEncontradaException(ID));

        mvc.perform(get("/api/v1/cuentas/" + ID).header(CABECERA, "CLI-0001"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Cuenta no encontrada"));
    }

    @Test
    void givenCuentaExistente_whenObtener_thenDevuelve200() throws Exception {
        when(service.obtener("CLI-0001", ID)).thenReturn(dto());

        mvc.perform(get("/api/v1/cuentas/" + ID).header(CABECERA, "CLI-0001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.moneda").value("PEN"));
    }
}
