package com.banco.cards.api;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardNotFoundException;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.service.CardQueryService;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CardController.class)
class CardControllerTest {

    private static final UUID ID = UUID.fromString("11111111-1111-4111-8111-111111111111");

    @Autowired
    private MockMvc mvc;

    @MockBean
    private CardQueryService service;

    private Card card() {
        return new Card(ID, "CUST-0001", "1111", "**** **** **** 1111", "VISA", "CREDIT",
                CardStatus.ACTIVE, new BigDecimal("5000.00"), new BigDecimal("3250.75"), "USD",
                Instant.parse("2026-01-01T00:00:00Z"));
    }

    @Test
    void givenCards_whenGetList_thenReturns200WithMaskedSummaries() throws Exception {
        when(service.listMyCards()).thenReturn(List.of(card()));

        mvc.perform(get("/api/v1/cards"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].maskedPan").value("**** **** **** 1111"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$[0].panLast4").doesNotExist());
    }

    @Test
    void givenExistingCard_whenGetDetail_thenReturns200() throws Exception {
        when(service.getMyCard(ID)).thenReturn(card());

        mvc.perform(get("/api/v1/cards/" + ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.panLast4").value("1111"))
                .andExpect(jsonPath("$.currency").value("USD"));
    }

    @Test
    void givenMissingCard_whenGetDetail_thenReturns404ProblemDetail() throws Exception {
        when(service.getMyCard(ID)).thenThrow(new CardNotFoundException(ID));

        mvc.perform(get("/api/v1/cards/" + ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void givenMalformedId_whenGetDetail_thenReturns400() throws Exception {
        mvc.perform(get("/api/v1/cards/no-es-uuid"))
                .andExpect(status().isBadRequest());
    }
}
