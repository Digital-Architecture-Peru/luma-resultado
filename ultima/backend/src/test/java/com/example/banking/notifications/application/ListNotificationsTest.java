package com.example.banking.notifications.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.banking.notifications.application.Fakes.FakeOwnership;
import com.example.banking.notifications.application.Fakes.InMemoryNotifications;
import com.example.banking.notifications.domain.DomainException;
import com.example.banking.notifications.domain.Notification;
import com.example.banking.notifications.domain.NotificationStatus;
import com.example.banking.notifications.domain.NotificationType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ListNotificationsTest {

    private static final Instant T0 = Instant.parse("2026-01-01T10:00:00Z");

    private InMemoryNotifications repo;
    private ListNotifications useCase;

    @BeforeEach
    void setUp() {
        repo = new InMemoryNotifications();
        useCase = new ListNotifications(repo, new FakeOwnership());
        Notification older = Notification.unread("acc-001", NotificationType.DEBIT, "Cargo", "Cargo ****1234", T0);
        Notification newer = Notification.unread("acc-001", NotificationType.CREDIT, "Abono", "Abono ****1234", T0.plusSeconds(60));
        repo.save(older);
        repo.save(newer.markRead(T0.plusSeconds(120)));
        repo.save(Notification.unread("acc-003", NotificationType.DEBIT, "Otro", "Otro ****9012", T0));
    }

    @Test
    void givenOwner_whenList_thenOnlyOwnAccountNewestFirst() {
        List<Notification> result = useCase.execute("cust-001", "acc-001", Optional.empty(), 0, 20);

        assertEquals(2, result.size());
        assertEquals("Abono", result.get(0).title());
    }

    @Test
    void givenStatusFilter_whenList_thenOnlyMatching() {
        List<Notification> result = useCase.execute("cust-001", "acc-001", Optional.of(NotificationStatus.UNREAD), 0, 20);

        assertEquals(1, result.size());
        assertEquals("Cargo", result.get(0).title());
    }

    @Test
    void givenPagination_whenSecondPage_thenSkipsFirst() {
        List<Notification> result = useCase.execute("cust-001", "acc-001", Optional.empty(), 1, 1);

        assertEquals(1, result.size());
        assertEquals("Cargo", result.get(0).title());
    }

    @Test
    void givenForeignAccount_whenList_thenAccessDenied() {
        assertThrows(DomainException.AccessDenied.class,
                () -> useCase.execute("cust-001", "acc-003", Optional.empty(), 0, 20));
    }

    @Test
    void givenInvalidPaging_whenList_thenInvalidRequest() {
        assertThrows(DomainException.InvalidRequest.class,
                () -> useCase.execute("cust-001", "acc-001", Optional.empty(), -1, 20));
        assertThrows(DomainException.InvalidRequest.class,
                () -> useCase.execute("cust-001", "acc-001", Optional.empty(), 0, 101));
    }
}
