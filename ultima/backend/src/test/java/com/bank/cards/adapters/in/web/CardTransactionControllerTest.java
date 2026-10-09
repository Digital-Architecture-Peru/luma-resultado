package com.bank.cards.adapters.in.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.bank.cards.application.BusinessRuleException;
import com.bank.cards.application.CardNotFoundException;
import com.bank.cards.application.CardQueryService;
import com.bank.cards.application.CreateTransactionUseCase;
import com.bank.cards.domain.CardTransaction;
import com.bank.cards.domain.TransactionStatus;

class CardTransactionControllerTest {

    private static final String CARD_ID = "11111111-1111-1111-1111-111111111111";
    private static final String URL = "/api/v1/cards/" + CARD_ID + "/transactions";
    private static final String VALID_BODY =
            "{\"amount\":100.50,\"currency\":\"USD\",\"sourceAccountId\":\"acc-1\",\"description\":\"pago\"}";

    private CreateTransactionUseCase useCase;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        useCase = mock(CreateTransactionUseCase.class);
        var controller = new CardTransactionController(useCase, mock(CardQueryService.class), "cust-demo-001");
        mvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void givenValidRequest_whenPost_thenCreated() throws Exception {
        var tx = new CardTransaction(UUID.randomUUID(), UUID.fromString(CARD_ID), new BigDecimal("100.50"),
                "USD", "acc-1", "pago", TransactionStatus.APPROVED, "k1", Instant.now());
        when(useCase.execute(any())).thenReturn(tx);

        mvc.perform(post(URL).header("Idempotency-Key", "k1")
                        .contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    void givenNegativeAmount_whenPost_thenBadRequest() throws Exception {
        String body = "{\"amount\":-5,\"currency\":\"USD\",\"sourceAccountId\":\"acc-1\"}";

        mvc.perform(post(URL).header("Idempotency-Key", "k1")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Solicitud invalida"));
    }

    @Test
    void givenMissingIdempotencyKey_whenPost_thenBadRequest() throws Exception {
        mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenUnknownCard_whenPost_thenNotFound() throws Exception {
        when(useCase.execute(any())).thenThrow(new CardNotFoundException(UUID.fromString(CARD_ID)));

        mvc.perform(post(URL).header("Idempotency-Key", "k1")
                        .contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isNotFound());
    }

    @Test
    void givenBusinessRuleViolation_whenPost_thenUnprocessable() throws Exception {
        when(useCase.execute(any())).thenThrow(new BusinessRuleException("Saldo disponible insuficiente"));

        mvc.perform(post(URL).header("Idempotency-Key", "k1")
                        .contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.detail").value("Saldo disponible insuficiente"));
    }
}
