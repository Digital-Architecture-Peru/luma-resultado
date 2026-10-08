package com.banco.cards.api;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banco.cards.api.dto.CardDetailDto;
import com.banco.cards.api.dto.CardSummaryDto;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import com.banco.cards.service.CardNotFoundException;
import com.banco.cards.service.CardQueryService;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class CardControllerTest {

    private static final UUID CARD_ID = UUID.fromString("11111111-1111-4111-8111-111111111111");

    private CardQueryService service;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        service = mock(CardQueryService.class);
        mvc = MockMvcBuilders.standaloneSetup(new CardController(service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void givenCards_whenGetList_thenReturns200WithMaskedPan() throws Exception {
        when(service.listCards()).thenReturn(List.of(new CardSummaryDto(CARD_ID, "**** **** **** 4821",
                CardType.CREDIT, CardStatus.ACTIVE, new BigDecimal("3250.75"), "USD")));

        mvc.perform(get("/api/v1/cards"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].maskedPan").value("**** **** **** 4821"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"));
    }

    @Test
    void givenCard_whenGetDetail_thenReturns200() throws Exception {
        when(service.getCard(CARD_ID)).thenReturn(new CardDetailDto(CARD_ID, "**** **** **** 4821",
                CardType.CREDIT, CardStatus.ACTIVE, new BigDecimal("5000.00"), new BigDecimal("3250.75"),
                "USD", 11, 2028));

        mvc.perform(get("/api/v1/cards/" + CARD_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.creditLimit").value(5000.00))
                .andExpect(jsonPath("$.maskedPan").value("**** **** **** 4821"));
    }

    @Test
    void givenUnknownCard_whenGetDetail_thenReturns404Problem() throws Exception {
        when(service.getCard(CARD_ID)).thenThrow(new CardNotFoundException());

        mvc.perform(get("/api/v1/cards/" + CARD_ID))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith("application/problem+json"))
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void givenInvalidId_whenGetDetail_thenReturns400() throws Exception {
        mvc.perform(get("/api/v1/cards/not-a-uuid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
