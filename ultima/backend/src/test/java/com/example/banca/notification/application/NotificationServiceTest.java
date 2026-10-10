package com.example.banca.notification.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.banca.notification.domain.Channel;
import com.example.banca.notification.domain.EventType;
import com.example.banca.notification.domain.NotificationRepository;
import com.example.banca.notification.domain.NotificationSender;
import com.example.banca.notification.domain.NotificationStatus;
import com.example.banca.notification.domain.PaymentEvent;
import com.example.banca.notification.domain.PaymentNotification;
import com.example.banca.notification.domain.Preference;
import com.example.banca.notification.domain.PreferenceRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Arrays;
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

    private static final Instant NOW = Instant.parse("2026-01-15T10:00:00Z");
    private static final String CUSTOMER = "CUST-0001";

    @Mock
    private NotificationRepository notifications;
    @Mock
    private PreferenceRepository preferenceRepository;
    @Mock
    private NotificationSender sender;

    private NotificationService service;

    @BeforeEach
    void setUp() {
        Clock clock = Clock.fixed(NOW, ZoneOffset.UTC);
        service = new NotificationService(notifications, new PreferenceService(preferenceRepository),
                sender, clock);
    }

    private PaymentEvent event() {
        return new PaymentEvent(CUSTOMER, "PAY-1", EventType.PAGO_EXITOSO,
                new BigDecimal("10.00"), "USD", "00112233441234");
    }

    @Test
    void givenAlreadyProcessedEvent_whenRegister_thenNothingIsSavedOrSent() {
        when(notifications.exists("PAY-1", EventType.PAGO_EXITOSO)).thenReturn(true);

        Optional<PaymentNotification> result = service.registerEvent(event());

        assertTrue(result.isEmpty());
        verify(notifications, never()).save(any());
        verify(sender, never()).send(any(), any());
    }

    @Test
    void givenAllChannelsDisabled_whenRegister_thenSenderIsNotInvoked() {
        when(notifications.exists("PAY-1", EventType.PAGO_EXITOSO)).thenReturn(false);
        when(preferenceRepository.findByCustomer(CUSTOMER)).thenReturn(
                Arrays.stream(Channel.values())
                        .map(c -> new Preference(EventType.PAGO_EXITOSO, c, false))
                        .toList());

        Optional<PaymentNotification> result = service.registerEvent(event());

        assertTrue(result.isEmpty());
        verify(sender, never()).send(any(), any());
        verify(notifications, never()).save(any());
    }

    @Test
    void givenDefaultPreferences_whenRegister_thenSavesMaskedNotificationAndSendsExternalChannels() {
        when(notifications.exists("PAY-1", EventType.PAGO_EXITOSO)).thenReturn(false);
        when(preferenceRepository.findByCustomer(CUSTOMER)).thenReturn(List.of());
        when(notifications.save(any())).thenAnswer(inv -> inv.getArgument(0));

        PaymentNotification saved = service.registerEvent(event()).orElseThrow();

        assertEquals("****1234", saved.maskedAccount());
        assertEquals(NotificationStatus.UNREAD, saved.status());
        assertEquals(NOW, saved.createdAt());
        verify(sender).send(eq(Channel.EMAIL), any());
        verify(sender).send(eq(Channel.SMS), any());
        verify(sender, never()).send(eq(Channel.IN_APP), any());
    }

    @Test
    void givenUnreadNotification_whenMarkRead_thenReadAtIsSet() {
        UUID id = UUID.randomUUID();
        PaymentNotification unread = new PaymentNotification(id, CUSTOMER, "PAY-1",
                EventType.PAGO_EXITOSO, BigDecimal.TEN, "USD", "****1234",
                NotificationStatus.UNREAD, NOW.minusSeconds(60), null);
        when(notifications.findByIdAndCustomer(id, CUSTOMER)).thenReturn(Optional.of(unread));
        when(notifications.save(any())).thenAnswer(inv -> inv.getArgument(0));

        PaymentNotification result = service.markRead(id, CUSTOMER);

        assertEquals(NotificationStatus.READ, result.status());
        assertEquals(NOW, result.readAt());
    }

    @Test
    void givenUnknownNotification_whenMarkRead_thenThrowsNotFound() {
        UUID id = UUID.randomUUID();
        when(notifications.findByIdAndCustomer(id, CUSTOMER)).thenReturn(Optional.empty());

        assertThrows(NotificationNotFoundException.class, () -> service.markRead(id, CUSTOMER));
    }

    @Test
    void givenOversizedPage_whenList_thenRejectsRequest() {
        assertThrows(IllegalArgumentException.class, () -> service.list(CUSTOMER, 0, 1000));
    }
}
