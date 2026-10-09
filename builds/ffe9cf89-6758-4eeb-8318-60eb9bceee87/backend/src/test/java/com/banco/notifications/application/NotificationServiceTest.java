package com.banco.notifications.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.banco.notifications.domain.CardRepository;
import com.banco.notifications.domain.Channel;
import com.banco.notifications.domain.Notification;
import com.banco.notifications.domain.NotificationPreference;
import com.banco.notifications.domain.NotificationPublisher;
import com.banco.notifications.domain.NotificationRepository;
import com.banco.notifications.domain.NotificationStatus;
import com.banco.notifications.domain.NotificationType;
import com.banco.notifications.domain.PreferenceRepository;
import com.banco.notifications.domain.ResourceNotFoundException;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    private static final String CUSTOMER = "CLI-0001";
    private static final Instant NOW = Instant.parse("2026-01-01T10:00:00Z");

    @Mock CardRepository cards;
    @Mock NotificationRepository notifications;
    @Mock PreferenceRepository preferences;
    @Mock NotificationPublisher publisher;

    private NotificationService service;
    private final UUID cardId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        service = new NotificationService(cards, notifications, preferences, publisher,
                Clock.fixed(NOW, ZoneOffset.UTC));
    }

    private Notification notification(NotificationStatus status) {
        return new Notification(UUID.randomUUID(), cardId, NotificationType.COMPRA, "Compra", "Detalle",
                new BigDecimal("10.00"), "USD", status, NOW.minusSeconds(60),
                status == NotificationStatus.READ ? NOW.minusSeconds(30) : null);
    }

    @Test
    void givenForeignCard_whenList_thenNotFoundAndNoQuery() {
        when(cards.existsForCustomer(cardId, CUSTOMER)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
                () -> service.listNotifications(CUSTOMER, cardId, null, 0, 20));
        verifyNoInteractions(notifications);
    }

    @Test
    void givenOversizedPage_whenList_thenIllegalArgument() {
        assertThrows(IllegalArgumentException.class,
                () -> service.listNotifications(CUSTOMER, cardId, null, 0, 101));
    }

    @Test
    void givenBlankCustomer_whenListCards_thenIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> service.listCards(" "));
    }

    @Test
    void givenUnreadNotification_whenMarkRead_thenSavedAndPublished() {
        Notification unread = notification(NotificationStatus.UNREAD);
        when(notifications.findByIdForCustomer(unread.id(), CUSTOMER)).thenReturn(Optional.of(unread));

        Notification result = service.markRead(CUSTOMER, unread.id());

        assertEquals(NotificationStatus.READ, result.status());
        assertEquals(NOW, result.readAt());
        verify(notifications).save(result);
        verify(publisher).publishRead(result);
    }

    @Test
    void givenReadNotification_whenMarkRead_thenIdempotent() {
        Notification read = notification(NotificationStatus.READ);
        when(notifications.findByIdForCustomer(read.id(), CUSTOMER)).thenReturn(Optional.of(read));

        Notification result = service.markRead(CUSTOMER, read.id());

        assertEquals(read, result);
        verify(notifications, never()).save(any());
        verifyNoInteractions(publisher);
    }

    @Test
    void givenUnknownNotification_whenMarkRead_thenNotFound() {
        UUID id = UUID.randomUUID();
        when(notifications.findByIdForCustomer(id, CUSTOMER)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.markRead(CUSTOMER, id));
    }

    @Test
    void givenStoredPreference_whenGet_thenReturnsFullMatrix() {
        when(cards.existsForCustomer(cardId, CUSTOMER)).thenReturn(true);
        when(preferences.findByCard(cardId)).thenReturn(
                List.of(new NotificationPreference(NotificationType.PAGO, Channel.EMAIL, true)));

        List<NotificationPreference> result = service.getPreferences(CUSTOMER, cardId);

        assertEquals(NotificationType.values().length * Channel.values().length, result.size());
        assertEquals(1, result.stream().filter(NotificationPreference::enabled).count());
        assertTrue(result.contains(new NotificationPreference(NotificationType.PAGO, Channel.EMAIL, true)));
    }

    @Test
    void givenUpdates_whenUpdatePreferences_thenPersisted() {
        List<NotificationPreference> updates =
                List.of(new NotificationPreference(NotificationType.BLOQUEO, Channel.SMS, true));
        when(cards.existsForCustomer(cardId, CUSTOMER)).thenReturn(true);
        when(preferences.findByCard(cardId)).thenReturn(updates);

        List<NotificationPreference> result = service.updatePreferences(CUSTOMER, cardId, updates);

        verify(preferences).saveAll(cardId, updates);
        assertTrue(result.contains(updates.get(0)));
    }
}
