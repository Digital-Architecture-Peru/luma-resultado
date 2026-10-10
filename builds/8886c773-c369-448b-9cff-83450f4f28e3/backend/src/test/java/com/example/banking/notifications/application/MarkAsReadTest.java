package com.example.banking.notifications.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.banking.notifications.application.Fakes.FakeOwnership;
import com.example.banking.notifications.application.Fakes.InMemoryNotifications;
import com.example.banking.notifications.domain.DomainException;
import com.example.banking.notifications.domain.Notification;
import com.example.banking.notifications.domain.NotificationStatus;
import com.example.banking.notifications.domain.NotificationType;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MarkAsReadTest {

    private static final Instant NOW = Instant.parse("2026-01-01T10:00:00Z");

    private InMemoryNotifications repo;
    private MarkAsRead useCase;
    private Notification own;
    private Notification foreign;

    @BeforeEach
    void setUp() {
        repo = new InMemoryNotifications();
        useCase = new MarkAsRead(repo, new FakeOwnership(), Clock.fixed(NOW, ZoneOffset.UTC));
        own = Notification.unread("acc-001", NotificationType.CREDIT, "Abono", "Abono a ****1234", NOW.minusSeconds(60));
        foreign = Notification.unread("acc-003", NotificationType.DEBIT, "Cargo", "Cargo ****9012", NOW.minusSeconds(60));
        repo.save(own);
        repo.save(foreign);
        repo.saves = 0;
    }

    @Test
    void givenOwnNotification_whenMarkAsRead_thenStatusReadAndTimestampSet() {
        Notification result = useCase.execute("cust-001", own.id());

        assertEquals(NotificationStatus.READ, result.status());
        assertEquals(NOW, result.readAt());
        assertEquals(NotificationStatus.READ, repo.store.get(own.id()).status());
    }

    @Test
    void givenForeignNotification_whenMarkAsRead_thenAccessDeniedAndNothingSaved() {
        assertThrows(DomainException.AccessDenied.class, () -> useCase.execute("cust-001", foreign.id()));

        assertEquals(NotificationStatus.UNREAD, repo.store.get(foreign.id()).status());
        assertEquals(0, repo.saves);
    }

    @Test
    void givenUnknownId_whenMarkAsRead_thenNotFound() {
        assertThrows(DomainException.NotFound.class, () -> useCase.execute("cust-001", UUID.randomUUID()));
    }

    @Test
    void givenMissingCustomer_whenMarkAsRead_thenMissingIdentity() {
        assertThrows(DomainException.MissingIdentity.class, () -> useCase.execute(" ", own.id()));
    }

    @Test
    void givenAlreadyRead_whenMarkAsReadAgain_thenIdempotentWithoutSaving() {
        useCase.execute("cust-001", own.id());
        repo.saves = 0;

        Notification again = useCase.execute("cust-001", own.id());

        assertNotNull(again.readAt());
        assertEquals(0, repo.saves);
    }
}
