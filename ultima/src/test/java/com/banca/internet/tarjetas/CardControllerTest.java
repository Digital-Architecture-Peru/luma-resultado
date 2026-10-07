package com.banca.internet.tarjetas;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banca.internet.tarjetas.organisms.CardQueryService;
import com.banca.internet.tarjetas.web.ApiExceptionHandler;
import com.banca.internet.tarjetas.web.CardController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class CardControllerTest {

    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        CardQueryService service = new CardQueryService(new FakeCardRepository());
        mvc = MockMvcBuilders.standaloneSetup(new CardController(service))
                .setControllerAdvice(new ApiExceptionHandler())
                .build();
    }

    @Test
    void givenCustomer_whenGetCards_thenOkWithMaskedNumbers() throws Exception {
        mvc.perform(get("/v1/cards").param("customerId", "CLI-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItems").value(3))
                .andExpect(jsonPath("$.items[0].maskedNumber").value("**** **** **** 1111"));
    }

    @Test
    void givenMissingCustomer_whenGetCards_thenBadRequest() throws Exception {
        mvc.perform(get("/v1/cards")).andExpect(status().isBadRequest());
    }

    @Test
    void givenUnknownStatus_whenGetCards_thenBadRequest() throws Exception {
        mvc.perform(get("/v1/cards").param("customerId", "CLI-1").param("status", "ZZZ"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenUnknownCard_whenGetById_thenNotFound() throws Exception {
        mvc.perform(get("/v1/cards/99").param("customerId", "CLI-1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void givenCard_whenGetById_thenOk() throws Exception {
        mvc.perform(get("/v1/cards/2").param("customerId", "CLI-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("BLOCKED"));
    }
}
