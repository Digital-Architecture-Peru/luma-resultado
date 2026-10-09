package com.example.cuentas.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

import com.example.cuentas.application.TransferService;
import com.example.cuentas.domain.DomainException;
import com.example.cuentas.domain.Transfer;
import java.math.BigDecimal;
import java.time.Instant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

class TransferControllerTest {

    private static final String BODY = """
            {"sourceAccountId":1,"targetAccountId":2,"amount":30.00,"currency":"USD","description":"Renta"}
            """;

    private TransferService service;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        service = mock(TransferService.class);
        mvc = standaloneSetup(new TransferController(service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder request(String body) {
        return post("/api/v1/transfers")
                .header("Idempotency-Key", "abc-123")
                .header("X-Customer-Id", "CLI-001")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body);
    }

    private Transfer sampleTransfer() {
        return Transfer.completed("abc-123", 1L, 2L, new BigDecimal("30.00"), "USD", "Renta", Instant.EPOCH);
    }

    @Test
    void givenNewTransfer_whenPost_thenCreated() throws Exception {
        when(service.execute(any())).thenReturn(new TransferService.Result(sampleTransfer(), false));

        mvc.perform(request(BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void givenReplayedTransfer_whenPost_thenOk() throws Exception {
        when(service.execute(any())).thenReturn(new TransferService.Result(sampleTransfer(), true));

        mvc.perform(request(BODY)).andExpect(status().isOk());
    }

    @Test
    void givenKeyReusedWithOtherBody_whenPost_thenConflict() throws Exception {
        when(service.execute(any())).thenThrow(DomainException.idempotencyConflict("clave repetida"));

        mvc.perform(request(BODY))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void givenBusinessRuleViolation_whenPost_thenUnprocessable() throws Exception {
        when(service.execute(any()))
                .thenThrow(DomainException.businessRule("INSUFFICIENT_FUNDS", "Saldo insuficiente"));

        mvc.perform(request(BODY))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status").value(422));
    }

    @Test
    void givenNegativeAmount_whenPost_thenBadRequest() throws Exception {
        String invalid = BODY.replace("30.00", "-1");

        mvc.perform(request(invalid)).andExpect(status().isBadRequest());
    }

    @Test
    void givenMissingIdempotencyKey_whenPost_thenBadRequest() throws Exception {
        mvc.perform(post("/api/v1/transfers")
                        .header("X-Customer-Id", "CLI-001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isBadRequest());
    }
}
