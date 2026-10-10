package com.example.banking.notifications.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.banking.notifications.application.ports.NotificationChannel;
import com.example.banking.notifications.domain.DomainException;
import com.example.banking.notifications.domain.Notification;
import com.example.banking.notifications.domain.NotificationStatus;
import com.example.banking.notifications.domain.NotificationType;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

class PublishNotificationTest {

    private static final Instant NOW = Instant.parse("2026-01-01T10:00:00Z");

    @Test
    void givenValidData_whenPublish_thenDeliveredAsUnread() {
        List<Notification> delivered = new ArrayList<>();
        NotificationChannel channel = delivered::add;
        PublishNotification useCase = new PublishNotification(channel, Clock.fixed(NOW, ZoneOffset.UTC));

        Notification result = useCase.execute("acc-001", NotificationType.LOW_BALANCE, "Saldo bajo", "Cuenta ****1234");

        assertEquals(1, delivered.size());
        assertEquals(NotificationStatus.UNREAD, result.status());
        assertEquals(NOW, result.createdAt());
    }

    @Test
    void givenBlankTitle_whenPublish_thenInvalidRequestAndNotDelivered() {
        List<Notification> delivered = new ArrayList<>();
        PublishNotification useCase = new PublishNotification(delivered::add, Clock.fixed(NOW, ZoneOffset.UTC));

        assertThrows(DomainException.InvalidRequest.class,
                () -> useCase.execute("acc-001", NotificationType.CREDIT, " ", "msg"));
        assertEquals(0, delivered.size());
    }
}
