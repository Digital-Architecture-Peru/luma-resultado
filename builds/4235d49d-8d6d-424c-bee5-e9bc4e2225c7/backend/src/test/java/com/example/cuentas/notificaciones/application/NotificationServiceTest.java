package com.example.cuentas.notificaciones.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.cuentas.notificaciones.domain.Notification;
import com.example.cuentas.notificaciones.domain.NotificationType;
import com.example.cuentas.notificaciones.domain.Preference;
import com.example.cuentas.notificaciones.domain.ports.NotificationDispatcher;
import com.example.cuentas.notificaciones.domain.ports.NotificationRepository;
import com.example.cuentas.notificaciones.domain.ports.PreferenceRepository;
import java.math.BigDecimal;
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
    private static final String ACCOUNT = "10001234";

    private NotificationRepository notifications;
    private PreferenceRepository preferences;
    private NotificationDispatcher dispatcher;
    private NotificationService service;

    @BeforeEach
    void setUp() {
        notifications = mock(NotificationRepository.class);
        preferences = mock(PreferenceRepository.class);
        dispatcher = mock(NotificationDispatcher.class);
        service = new NotificationService(notifications, preferences, dispatcher,
                Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void givenInvalidPageSize_whenList_thenThrowsIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> service.list(ACCOUNT, false, 0, 101));
        assertThrows(IllegalArgumentException.class, () -> service.list(ACCOUNT, false, -1, 10));
    }

    @Test
    void givenValidPaging_whenList_thenDelegatesToRepository() {
        Notification n = unread(UUID.randomUUID());
        when(notifications.findByAccount(ACCOUNT, true, 0, 20)).thenReturn(List.of(n));

        assertEquals(List.of(n), service.list(ACCOUNT, true, 0, 20));
    }

    @Test
    void givenUnknownId_whenMarkRead_thenThrowsNotFound() {
        UUID id = UUID.randomUUID();
        when(notifications.findById(id)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.markRead(id));
    }

    @Test
    void givenUnreadNotification_whenMarkRead_thenPersistsReadTimestamp() {
        UUID id = UUID.randomUUID();
        when(notifications.findById(id)).thenReturn(Optional.of(unread(id)));

        Notification result = service.markRead(id);

        assertTrue(result.isRead());
        assertEquals(NOW, result.readAt());
        verify(notifications).markRead(id, NOW);
    }

    @Test
    void givenAlreadyRead_whenMarkRead_thenDoesNotWriteAgain() {
        UUID id = UUID.randomUUID();
        when(notifications.findById(id)).thenReturn(Optional.of(unread(id).markRead(NOW.minusSeconds(60))));

        service.markRead(id);

        verify(notifications, never()).markRead(any(), any());
    }

    @Test
    void givenDepositDisabled_whenRegisterDeposit_thenNothingIsSavedOrDispatched() {
        when(preferences.find(ACCOUNT)).thenReturn(Optional.of(
                new Preference(ACCOUNT, new BigDecimal("100.00"), false, true, NOW)));

        Optional<Notification> result = service.register(ACCOUNT, NotificationType.DEPOSIT,
                "Depósito", new BigDecimal("10.00"));

        assertTrue(result.isEmpty());
        verify(notifications, never()).save(any());
        verify(dispatcher, never()).dispatch(any());
    }

    @Test
    void givenBalanceAboveThreshold_whenRegisterLowBalance_thenSkipped() {
        when(preferences.find(ACCOUNT)).thenReturn(Optional.empty());

        Optional<Notification> result = service.register(ACCOUNT, NotificationType.LOW_BALANCE,
                "Saldo bajo", new BigDecimal("500.00"));

        assertFalse(result.isPresent());
    }

    @Test
    void givenBalanceBelowThreshold_whenRegisterLowBalance_thenSavedAndDispatched() {
        when(preferences.find(ACCOUNT)).thenReturn(Optional.empty());

        Optional<Notification> result = service.register(ACCOUNT, NotificationType.LOW_BALANCE,
                "Saldo bajo", new BigDecimal("50.00"));

        assertTrue(result.isPresent());
        assertFalse(result.get().isRead());
        assertEquals(NOW, result.get().createdAt());
        verify(notifications).save(result.get());
        verify(dispatcher).dispatch(result.get());
    }

    private static Notification unread(UUID id) {
        return new Notification(id, ACCOUNT, NotificationType.DEPOSIT, "Depósito",
                new BigDecimal("10.00"), null, NOW.minusSeconds(3600));
    }
}
