package com.banco.tarjetas.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banco.tarjetas.repository.InMemoryTarjetaRepository;
import com.banco.tarjetas.service.TarjetaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class TarjetaControllerTest {

    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        TarjetaService service = new TarjetaService(new InMemoryTarjetaRepository());
        mvc = MockMvcBuilders.standaloneSetup(new TarjetaController(service))
                .setControllerAdvice(new ApiExceptionHandler())
                .build();
    }

    @Test
    void givenPeticion_whenListar_thenOkConCuatroTarjetas() throws Exception {
        mvc.perform(get("/api/v1/tarjetas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4));
    }

    @Test
    void givenFiltroBloqueada_whenListar_thenUnaTarjeta() throws Exception {
        mvc.perform(get("/api/v1/tarjetas").param("estado", "BLOQUEADA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value("t-003"));
    }

    @Test
    void givenEstadoInvalido_whenListar_thenBadRequest() throws Exception {
        mvc.perform(get("/api/v1/tarjetas").param("estado", "NOPE"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Parámetro inválido"));
    }

    @Test
    void givenIdInexistente_whenObtener_thenNotFound() throws Exception {
        mvc.perform(get("/api/v1/tarjetas/zzz"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void givenIdExistente_whenObtener_thenOk() throws Exception {
        mvc.perform(get("/api/v1/tarjetas/t-002"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipo").value("DEBITO"));
    }
}
