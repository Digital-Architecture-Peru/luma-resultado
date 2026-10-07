package com.bank.cards.api;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.bank.cards.domain.Card;
import com.bank.cards.domain.CardStatus;
import com.bank.cards.domain.CardType;
import com.bank.cards.service.CardNotFoundException;
import com.bank.cards.service.CardQueryService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CardController.class)
class CardControllerTest {

    private static final String HEADER = "X-Customer-Id";
    private static final UUID CARD_ID = UUID.fromString("11111111-1111-4111-8111-111111111111");

    @Autowired
    private MockMvc mvc;

    @MockBean
    private CardQueryService service;

    private Card card() {
        return new Card(CARD_ID, "CUST-1001", "Visa Platinum", "4821", CardType.CREDIT, CardStatus.ACTIVE,
                new BigDecimal("15000.00"), new BigDecimal("9820.55"), "USD", LocalDate.of(2028, 9, 30));
    }

    @Test
    void givenCustomer_whenListCards_thenReturnsMaskedSummaries() throws Exception {
        when(service.listCards("CUST-1001")).thenReturn(List.of(card()));

        mvc.perform(get("/api/v1/cards").header(HEADER, "CUST-1001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].maskedNumber").value("**** **** **** 4821"))
                .andExpect(jsonPath("$[0].alias").value("Visa Platinum"))
                .andExpect(jsonPath("$[0].last4").doesNotExist());
    }

    @Test
    void givenOwnedCard_whenGetDetail_thenReturnsDetail() throws Exception {
        when(service.getCard("CUST-1001", CARD_ID)).thenReturn(card());

        mvc.perform(get("/api/v1/cards/" + CARD_ID).header(HEADER, "CUST-1001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.creditLimit").value(15000.00))
                .andExpect(jsonPath("$.expiryDate").value("2028-09-30"));
    }

    @Test
    void givenUnknownCard_whenGetDetail_thenReturns404ProblemDetail() throws Exception {
        when(service.getCard("CUST-2002", CARD_ID)).thenThrow(new CardNotFoundException(CARD_ID));

        mvc.perform(get("/api/v1/cards/" + CARD_ID).header(HEADER, "CUST-2002"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith("application/problem+json"))
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void givenMissingHeader_whenListCards_thenReturns400() throws Exception {
        mvc.perform(get("/api/v1/cards")).andExpect(status().isBadRequest());
    }

    @Test
    void givenMalformedCardId_whenGetDetail_thenReturns400() throws Exception {
        mvc.perform(get("/api/v1/cards/not-a-uuid").header(HEADER, "CUST-1001"))
                .andExpect(status().isBadRequest());
    }
}
