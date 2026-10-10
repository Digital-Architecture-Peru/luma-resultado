package com.example.notifications.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.notifications.domain.Notification;
import com.example.notifications.domain.NotificationStatus;
import com.example.notifications.domain.NotificationType;
import com.example.notifications.port.NotificationChannel;
import com.example.notifications.port.NotificationRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    private static final Instant NOW = Instant.parse("2026-01-01T10:00:00Z");

    @Mock
    private NotificationRepository repository;
    @Mock
    private NotificationChannel channel;

    private NotificationService service;

    @BeforeEach
    void setUp() {
        service = new NotificationService(repository, channel, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    private Notification sample(NotificationStatus status) {
        return new Notification(7L, "CUST-001", "PAY-1", NotificationType.PAYMENT_SUCCESS,
                new BigDecimal("10.00"), "USD", "****1234", status, NOW, null);
    }

    @Test
    void givenNewPayment_whenCreate_thenMasksAccountSavesAndSends() {
        when(repository.findByReferenceAndType("PAY-1", NotificationType.PAYMENT_SUCCESS))
                .thenReturn(Optional.empty());
        when(repository.save(any(Notification.class))).thenAnswer(inv -> ((Notification) inv.getArgument(0)).withId(7L));

        Notification result = service.create("CUST-001", "PAY-1", NotificationType.PAYMENT_SUCCESS,
                new BigDecimal("10.00"), "usd", "0000-1111-2222-1234");

        assertEquals("****1234", result.maskedAccount());
        assertEquals("USD", result.currency());
        assertEquals(NotificationStatus.UNREAD, result.status());
        assertEquals(7L, result.id());
        verify(channel).send(result);
    }

    @Test
    void givenExistingNotification_whenCreate_thenIsIdempotent() {
        Notification existing = sample(NotificationStatus.UNREAD);
        when(repository.findByReferenceAndType("PAY-1", NotificationType.PAYMENT_SUCCESS))
                .thenReturn(Optional.of(existing));

        Notification result = service.create("CUST-001", "PAY-1", NotificationType.PAYMENT_SUCCESS,
                new BigDecimal("10.00"), "USD", "12345678");

        assertSame(existing, result);
        verify(repository, never()).save(any());
        verify(channel, never()).send(any());
    }

    @Test
    void givenShortAccount_whenCreate_thenRejects() {
        when(repository.findByReferenceAndType("PAY-1", NotificationType.PAYMENT_FAILED))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.create("CUST-001", "PAY-1",
                NotificationType.PAYMENT_FAILED, new BigDecimal("5.00"), "USD", "12"));
    }

    @Test
    void givenUnread_whenMarkAsRead_thenPersistsAndReturnsRead() {
        when(repository.findByIdAndCustomer(7L, "CUST-001")).thenReturn(Optional.of(sample(NotificationStatus.UNREAD)));

        Notification result = service.markAsRead(7L, "CUST-001");

        assertTrue(result.isRead());
        assertEquals(NOW, result.readAt());
        verify(repository).markRead(7L, "CUST-001", NOW);
    }

    @Test
    void givenAlreadyRead_whenMarkAsRead_thenDoesNotUpdateAgain() {
        when(repository.findByIdAndCustomer(7L, "CUST-001")).thenReturn(Optional.of(sample(NotificationStatus.READ)));

        service.markAsRead(7L, "CUST-001");

        verify(repository, never()).markRead(any(Long.class), any(), any());
    }

    @Test
    void givenUnknownId_whenMarkAsRead_thenThrowsNotFound() {
        when(repository.findByIdAndCustomer(99L, "CUST-001")).thenReturn(Optional.empty());

        assertThrows(NotificationNotFoundException.class, () -> service.markAsRead(99L, "CUST-001"));
    }

    @Test
    void givenStatusFilter_whenList_thenDelegatesToRepository() {
        List<Notification> unread = List.of(sample(NotificationStatus.UNREAD));
        when(repository.findByCustomer("CUST-001", NotificationStatus.UNREAD)).thenReturn(unread);

        assertEquals(unread, service.list("CUST-001", NotificationStatus.UNREAD));
    }
}
