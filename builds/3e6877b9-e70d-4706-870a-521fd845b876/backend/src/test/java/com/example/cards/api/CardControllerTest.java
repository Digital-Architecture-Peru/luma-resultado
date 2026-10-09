package com.example.cards.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.cards.domain.Card;
import com.example.cards.domain.CardQueryService;
import com.example.cards.domain.CardTransaction;
import com.example.cards.domain.DomainErrors.DuplicatePaymentException;
import com.example.cards.domain.DomainErrors.PaymentRejectedException;
import com.example.cards.domain.PaymentService;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CardController.class)
class CardControllerTest {

    private static final String BODY = "{\"sourceAccountId\":\"acc-1\",\"amount\":\"150.00\"}";

    @Autowired
    private MockMvc mvc;
    @MockBean
    private PaymentService paymentService;
    @MockBean
    private CardQueryService queryService;

    @Test
    void givenCustomer_whenListCards_thenReturnsMaskedCards() throws Exception {
        when(queryService.listCards("cust-001")).thenReturn(List.of(
                new Card("card-1", "cust-001", "4242", "VISA", new BigDecimal("5000.00"), new BigDecimal("1250.50"), 0)));

        mvc.perform(get("/api/v1/cards").header("X-Customer-Id", "cust-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].last4").value("4242"))
                .andExpect(jsonPath("$[0].balance").value("1250.50"));
    }

    @Test
    void givenValidPayment_whenPost_thenCreated() throws Exception {
        when(paymentService.pay(eq("cust-001"), eq("card-1"), any())).thenReturn(new CardTransaction(
                "tx-1", "card-1", "PAYMENT", new BigDecimal("150.00"), "POSTED", "key-1",
                Instant.parse("2026-10-09T20:00:00Z")));

        mvc.perform(post("/api/v1/cards/card-1/payments")
                        .header("X-Customer-Id", "cust-001")
                        .header("Idempotency-Key", "key-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionId").value("tx-1"))
                .andExpect(jsonPath("$.amount").value("150.00"));
    }

    @Test
    void givenMissingIdempotencyKey_whenPost_thenBadRequest() throws Exception {
        mvc.perform(post("/api/v1/cards/card-1/payments")
                        .header("X-Customer-Id", "cust-001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenBlankAccount_whenPost_thenBadRequest() throws Exception {
        mvc.perform(post("/api/v1/cards/card-1/payments")
                        .header("X-Customer-Id", "cust-001")
                        .header("Idempotency-Key", "key-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sourceAccountId\":\"\",\"amount\":\"10.00\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenDuplicateKey_whenPost_thenConflict() throws Exception {
        when(paymentService.pay(any(), any(), any())).thenThrow(new DuplicatePaymentException());

        mvc.perform(post("/api/v1/cards/card-1/payments")
                        .header("X-Customer-Id", "cust-001")
                        .header("Idempotency-Key", "key-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void givenInsufficientFunds_whenPost_thenUnprocessable() throws Exception {
        when(paymentService.pay(any(), any(), any()))
                .thenThrow(new PaymentRejectedException("Saldo insuficiente en la cuenta de origen"));

        mvc.perform(post("/api/v1/cards/card-1/payments")
                        .header("X-Customer-Id", "cust-001")
                        .header("Idempotency-Key", "key-2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.detail").value("Saldo insuficiente en la cuenta de origen"));
    }
}
