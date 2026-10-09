package com.banco.notifications.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banco.notifications.application.NotificationService;
import com.banco.notifications.domain.Channel;
import com.banco.notifications.domain.Notification;
import com.banco.notifications.domain.NotificationPreference;
import com.banco.notifications.domain.NotificationStatus;
import com.banco.notifications.domain.NotificationType;
import com.banco.notifications.domain.PagedResult;
import com.banco.notifications.domain.ResourceNotFoundException;
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

    private static final String HEADER = "X-Customer-Id";

    @Autowired MockMvc mvc;
    @MockBean NotificationService service;

    private final UUID cardId = UUID.randomUUID();

    private Notification sample() {
        return new Notification(UUID.randomUUID(), cardId, NotificationType.COMPRA, "Compra", "Detalle",
                new BigDecimal("10.00"), "USD", NotificationStatus.UNREAD, Instant.parse("2026-01-01T10:00:00Z"), null);
    }

    @Test
    void givenCustomer_whenListNotifications_thenReturnsPage() throws Exception {
        when(service.listNotifications("CLI-0001", cardId, NotificationStatus.UNREAD, 0, 20))
                .thenReturn(new PagedResult<>(List.of(sample()), 0, 20, 1));

        mvc.perform(get("/api/v1/cards/{id}/notifications", cardId)
                        .param("status", "UNREAD").header(HEADER, "CLI-0001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].type").value("COMPRA"))
                .andExpect(jsonPath("$.items[0].status").value("UNREAD"));
    }

    @Test
    void givenMissingHeader_whenList_thenBadRequestProblemDetail() throws Exception {
        mvc.perform(get("/api/v1/cards/{id}/notifications", cardId))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenInvalidStatus_whenList_thenBadRequest() throws Exception {
        mvc.perform(get("/api/v1/cards/{id}/notifications", cardId)
                        .param("status", "NOPE").header(HEADER, "CLI-0001"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenUnknownCard_whenList_thenNotFound() throws Exception {
        when(service.listNotifications(eq("CLI-0001"), eq(cardId), any(), eq(0), eq(20)))
                .thenThrow(new ResourceNotFoundException("Tarjeta no encontrada"));

        mvc.perform(get("/api/v1/cards/{id}/notifications", cardId).header(HEADER, "CLI-0001"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Tarjeta no encontrada"));
    }

    @Test
    void givenNotification_whenMarkRead_thenReturnsUpdated() throws Exception {
        Notification n = sample().markRead(Instant.parse("2026-01-01T11:00:00Z"));
        when(service.markRead("CLI-0001", n.id())).thenReturn(n);

        mvc.perform(patch("/api/v1/notifications/{id}/read", n.id()).header(HEADER, "CLI-0001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("READ"));
    }

    @Test
    void givenPreferences_whenPut_thenReturnsMatrix() throws Exception {
        when(service.updatePreferences(eq("CLI-0001"), eq(cardId), any()))
                .thenReturn(List.of(new NotificationPreference(NotificationType.PAGO, Channel.EMAIL, true)));

        mvc.perform(put("/api/v1/cards/{id}/notification-preferences", cardId)
                        .header(HEADER, "CLI-0001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"preferences\":[{\"type\":\"PAGO\",\"channel\":\"EMAIL\",\"enabled\":true}]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preferences[0].channel").value("EMAIL"));
    }

    @Test
    void givenInvalidBody_whenPutPreferences_thenBadRequest() throws Exception {
        mvc.perform(put("/api/v1/cards/{id}/notification-preferences", cardId)
                        .header(HEADER, "CLI-0001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"preferences\":[{\"type\":null,\"channel\":\"EMAIL\",\"enabled\":true}]}"))
                .andExpect(status().isBadRequest());
    }
}
