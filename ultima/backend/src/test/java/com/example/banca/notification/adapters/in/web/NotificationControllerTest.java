package com.example.banca.notification.adapters.in.web;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.banca.notification.application.NotificationNotFoundException;
import com.example.banca.notification.application.NotificationService;
import com.example.banca.notification.domain.EventType;
import com.example.banca.notification.domain.NotificationStatus;
import com.example.banca.notification.domain.PageResult;
import com.example.banca.notification.domain.PaymentNotification;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(NotificationController.class)
class NotificationControllerTest {

    private static final String BASE = "/api/v1/payment-notifications";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService service;

    private PaymentNotification sample(UUID id) {
        return new PaymentNotification(id, "CUST-0001", "PAY-1", EventType.PAGO_EXITOSO,
                new BigDecimal("10.00"), "USD", "****1234", NotificationStatus.UNREAD,
                Instant.parse("2026-01-15T10:00:00Z"), null);
    }

    @Test
    void givenCustomerHeader_whenList_thenReturnsPageWithMaskedAccount() throws Exception {
        UUID id = UUID.randomUUID();
        given(service.list("CUST-0001", 0, 20))
                .willReturn(new PageResult<>(List.of(sample(id)), 0, 20, 1));

        mockMvc.perform(get(BASE).header("X-Customer-Id", "CUST-0001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.items[0].id").value(id.toString()))
                .andExpect(jsonPath("$.items[0].maskedAccount").value("****1234"))
                .andExpect(jsonPath("$.items[0].status").value("UNREAD"));
    }

    @Test
    void givenNoCustomerHeader_whenList_thenReturnsBadRequest() throws Exception {
        mockMvc.perform(get(BASE)).andExpect(status().isBadRequest());
    }

    @Test
    void givenUnknownId_whenMarkRead_thenReturnsProblemJson404() throws Exception {
        UUID id = UUID.randomUUID();
        given(service.markRead(id, "CUST-0001")).willThrow(new NotificationNotFoundException(id));

        mockMvc.perform(patch(BASE + "/" + id + "/read").header("X-Customer-Id", "CUST-0001"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @Test
    void givenInvalidPageSize_whenList_thenReturnsBadRequest() throws Exception {
        given(service.list("CUST-0001", 0, 500)).willThrow(new IllegalArgumentException("size inválido"));

        mockMvc.perform(get(BASE).param("size", "500").header("X-Customer-Id", "CUST-0001"))
                .andExpect(status().isBadRequest());
    }
}
