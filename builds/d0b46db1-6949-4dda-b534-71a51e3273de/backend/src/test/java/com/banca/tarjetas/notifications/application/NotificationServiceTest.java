package com.banca.tarjetas.notifications.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.banca.tarjetas.notifications.application.port.NotificationDispatcher;
import com.banca.tarjetas.notifications.application.port.NotificationRepository;
import com.banca.tarjetas.notifications.domain.Notification;
import com.banca.tarjetas.notifications.domain.NotificationStatus;
import com.banca.tarjetas.notifications.domain.NotificationType;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NotificationServiceTest {

    private static final Instant NOW = Instant.parse("2026-01-15T10:00:00Z");

    private NotificationRepository repository;
    private NotificationDispatcher dispatcher;
    private NotificationService service;

    @BeforeEach
    void setUp() {
        repository = mock(NotificationRepository.class);
        dispatcher = mock(NotificationDispatcher.class);
        service = new NotificationService(repository, dispatcher, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void givenValidPaging_whenList_thenDelegatesToRepository() {
        PageResult<Notification> expected = new PageResult<>(List.of(), 0, 20, 0);
        when(repository.findByCard("C1", "K1", Optional.empty(), 0, 20)).thenReturn(expected);

        assertEquals(expected, service.listByCard("C1", "K1", Optional.empty(), 0, 20));
    }

    @Test
    void givenNegativePage_whenList_thenRejects() {
        assertThrows(IllegalArgumentException.class,
                () -> service.listByCard("C1", "K1", Optional.empty(), -1, 20));
    }

    @Test
    void givenOversizedPage_whenList_thenRejects() {
        assertThrows(IllegalArgumentException.class,
                () -> service.listByCard("C1", "K1", Optional.empty(), 0, 51));
    }

    @Test
    void givenStatusFilter_whenList_thenPassesItThrough() {
        PageResult<Notification> expected = new PageResult<>(List.of(), 0, 10, 0);
        when(repository.findByCard("C1", "K1", Optional.of(NotificationStatus.UNREAD), 0, 10))
                .thenReturn(expected);

        assertEquals(expected,
                service.listByCard("C1", "K1", Optional.of(NotificationStatus.UNREAD), 0, 10));
    }

    @Test
    void givenUnreadNotifications_whenCount_thenReturnsRepositoryValue() {
        when(repository.countUnread("C1")).thenReturn(3L);

        assertEquals(3L, service.unreadCount("C1"));
    }

    @Test
    void givenExistingNotification_whenMarkAsRead_thenUsesClockTime() {
        UUID id = UUID.randomUUID();
        when(repository.markAsRead("C1", id, NOW)).thenReturn(true);

        service.markAsRead("C1", id);

        verify(repository).markAsRead("C1", id, NOW);
    }

    @Test
    void givenUnknownNotification_whenMarkAsRead_thenThrowsNotFound() {
        UUID id = UUID.randomUUID();
        when(repository.markAsRead("C1", id, NOW)).thenReturn(false);

        assertThrows(NotificationNotFoundException.class, () -> service.markAsRead("C1", id));
    }

    @Test
    void givenValidData_whenRegister_thenSavesAndDispatchesUnreadNotification() {
        Notification created = service.register("C1", "K1", "4242",
                NotificationType.TRANSACTION, "Compra", "Compra aprobada");

        assertEquals(NotificationStatus.UNREAD, created.status());
        assertEquals(NOW, created.createdAt());
        assertTrue(created.isUnread());
        verify(repository).save(created);
        verify(dispatcher).dispatch(created);
    }

    @Test
    void givenInvalidLast4_whenRegister_thenNothingIsSavedOrDispatched() {
        assertThrows(IllegalArgumentException.class, () -> service.register("C1", "K1", "42A2",
                NotificationType.TRANSACTION, "Compra", "Compra aprobada"));

        verify(repository, never()).save(any());
        verify(dispatcher, never()).dispatch(any());
    }
}
