package com.banca.tarjetas.notifications.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.banca.tarjetas.notifications.api.dto.NotificationResponse;
import com.banca.tarjetas.notifications.domain.Notification;
import com.banca.tarjetas.notifications.domain.NotificationStatus;
import com.banca.tarjetas.notifications.domain.NotificationType;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class NotificationResponseTest {

    @Test
    void givenDomainNotification_whenMapped_thenExposesOnlyPublicFields() {
        UUID id = UUID.randomUUID();
        Instant created = Instant.parse("2026-01-15T10:00:00Z");
        Notification n = new Notification(id, "C1", "K1", "4242", NotificationType.PAYMENT_DUE,
                "Pago", "Vence pronto", NotificationStatus.UNREAD, created, null);

        NotificationResponse response = NotificationResponse.from(n);

        assertEquals(id, response.id());
        assertEquals("K1", response.cardRef());
        assertEquals("4242", response.last4());
        assertEquals("PAYMENT_DUE", response.type());
        assertEquals("UNREAD", response.status());
        assertEquals(created, response.createdAt());
        assertNull(response.readAt());
    }
}
