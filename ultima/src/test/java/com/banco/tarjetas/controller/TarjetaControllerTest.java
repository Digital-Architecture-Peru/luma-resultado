package com.banco.tarjetas.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banco.tarjetas.exception.GlobalExceptionHandler;
import com.banco.tarjetas.molecules.TarjetaMapper;
import com.banco.tarjetas.repository.InMemoryTarjetaRepository;
import com.banco.tarjetas.service.TarjetaConsultaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class TarjetaControllerTest {

    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        TarjetaConsultaService servicio =
                new TarjetaConsultaService(new InMemoryTarjetaRepository(), new TarjetaMapper());
        mvc = MockMvcBuilders.standaloneSetup(new TarjetaController(servicio))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void givenRequest_whenListar_thenOkConCuatroTarjetas() throws Exception {
        mvc.perform(get("/v1/tarjetas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4));
    }

    @Test
    void givenId_whenObtener_thenOkSinNumeroCompleto() throws Exception {
        mvc.perform(get("/v1/tarjetas/TC-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numeroEnmascarado").value("************1111"))
                .andExpect(jsonPath("$.numero").doesNotExist());
    }

    @Test
    void givenIdInexistente_whenObtener_then404() throws Exception {
        mvc.perform(get("/v1/tarjetas/TC-999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void givenFiltroInvalido_whenListar_then400() throws Exception {
        mvc.perform(get("/v1/tarjetas").param("estado", "NOPE"))
                .andExpect(status().isBadRequest());
    }
}
