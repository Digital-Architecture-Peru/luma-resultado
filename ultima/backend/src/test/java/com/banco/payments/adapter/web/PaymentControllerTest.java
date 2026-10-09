package com.banco.payments.adapter.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banco.payments.application.PaymentErrors;
import com.banco.payments.application.PaymentService;
import com.banco.payments.domain.Payment;
import com.banco.payments.domain.PaymentStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class PaymentControllerTest {

    private static final String SOURCE = "11111111-1111-4111-8111-111111111111";

    private PaymentService service;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        service = mock(PaymentService.class);
        mvc = MockMvcBuilders.standaloneSetup(new PaymentController(service))
                .setControllerAdvice(new ErrorHandler())
                .build();
    }

    private static String body(String amount) {
        return "{\"sourceAccountId\":\"" + SOURCE + "\",\"targetAccount\":\"EC00-9999-0001\","
                + "\"amount\":" + amount + ",\"currency\":\"USD\",\"reference\":\"Renta\"}";
    }

    private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder request(String json) {
        return post("/api/v1/payments")
                .header("Idempotency-Key", "key-1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json);
    }

    @Test
    void givenValidRequest_whenPost_thenCreated() throws Exception {
        UUID id = UUID.randomUUID();
        when(service.create(any())).thenReturn(new Payment(id, "key-1", UUID.fromString(SOURCE),
                "EC00-9999-0001", new BigDecimal("25.00"), "USD", PaymentStatus.COMPLETED, "Renta", Instant.EPOCH));

        mvc.perform(request(body("25.00")))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/v1/payments/" + id))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void givenNegativeAmount_whenPost_thenBadRequest() throws Exception {
        mvc.perform(request(body("-5")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Solicitud invalida"));
    }

    @Test
    void givenMoreThanTwoDecimals_whenPost_thenBadRequest() throws Exception {
        mvc.perform(request(body("10.123"))).andExpect(status().isBadRequest());
    }

    @Test
    void givenMissingIdempotencyKey_whenPost_thenBadRequest() throws Exception {
        mvc.perform(post("/api/v1/payments").contentType(MediaType.APPLICATION_JSON).content(body("10.00")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenInsufficientFunds_whenPost_thenUnprocessable() throws Exception {
        when(service.create(any())).thenThrow(new PaymentErrors.InsufficientFunds("Saldo insuficiente"));

        mvc.perform(request(body("10.00"))).andExpect(status().isUnprocessableEntity());
    }

    @Test
    void givenIdempotencyConflict_whenPost_thenConflict() throws Exception {
        when(service.create(any())).thenThrow(new PaymentErrors.IdempotencyConflict("usada"));

        mvc.perform(request(body("10.00"))).andExpect(status().isConflict());
    }

    @Test
    void givenUnexpectedFailure_whenPost_thenGenericServerError() throws Exception {
        when(service.create(any())).thenThrow(new IllegalStateException("detalle interno"));

        mvc.perform(request(body("10.00")))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.detail").value("No fue posible procesar la solicitud"));
    }
}
