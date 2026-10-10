package com.banca.pagos.notification.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banca.pagos.notification.domain.NotificationStatus;
import com.banca.pagos.notification.domain.NotificationType;
import com.banca.pagos.notification.domain.PaymentNotification;
import com.banca.pagos.notification.port.NotificationChannel;
import com.banca.pagos.notification.port.NotificationRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PaymentNotificationServiceTest {

    private static final String CUSTOMER = "CUST-0001";
    private static final Instant NOW = Instant.parse("2026-10-09T12:00:00Z");

    private InMemoryRepository repository;
    private List<PaymentNotification> sent;
    private PaymentNotificationService service;

    @BeforeEach
    void setUp() {
        repository = new InMemoryRepository();
        sent = new ArrayList<>();
        NotificationChannel channel = sent::add;
        service = new PaymentNotificationService(repository, channel, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    private PaymentEvent event(String reference, NotificationType type) {
        return new PaymentEvent(CUSTOMER, reference, type, "1234567890", new BigDecimal("125.5"), "USD");
    }

    @Test
    void givenPaymentEvent_whenRegister_thenMasksAccountAndSendsToChannel() {
        PaymentNotification created = service.register(event("PAY-1", NotificationType.PAGO_EXITOSO));

        assertEquals(NotificationStatus.UNREAD, created.status());
        assertEquals(new BigDecimal("125.50"), created.amount());
        assertTrue(created.message().contains("****7890"));
        assertFalse(created.message().contains("1234567890"));
        assertEquals(NOW, created.createdAt());
        assertEquals(1, sent.size());
    }

    @Test
    void givenSameReferenceAndType_whenRegisterTwice_thenDuplicate() {
        service.register(event("PAY-1", NotificationType.PAGO_EXITOSO));

        NotificationException error = assertThrows(NotificationException.class,
                () -> service.register(event("PAY-1", NotificationType.PAGO_EXITOSO)));

        assertEquals(NotificationException.Code.DUPLICATE, error.code());
        assertEquals(1, sent.size());
    }

    @Test
    void givenSameReferenceDifferentType_whenRegister_thenAllowed() {
        service.register(event("PAY-1", NotificationType.PAGO_PROGRAMADO_PROXIMO));
        PaymentNotification second = service.register(event("PAY-1", NotificationType.PAGO_EXITOSO));

        assertNotNull(second.id());
        assertEquals(2, repository.store.size());
    }

    @Test
    void givenNonPositiveAmount_whenRegister_thenInvalid() {
        PaymentEvent bad = new PaymentEvent(CUSTOMER, "PAY-2", NotificationType.PAGO_RECHAZADO,
                "1234567890", BigDecimal.ZERO, "USD");

        NotificationException error = assertThrows(NotificationException.class, () -> service.register(bad));

        assertEquals(NotificationException.Code.INVALID_REQUEST, error.code());
    }

    @Test
    void givenUnreadNotification_whenMarkAsRead_thenStatusReadWithTimestamp() {
        PaymentNotification created = service.register(event("PAY-1", NotificationType.PAGO_EXITOSO));

        service.markAsRead(CUSTOMER, created.id());

        PaymentNotification stored = repository.store.get(created.id());
        assertEquals(NotificationStatus.READ, stored.status());
        assertEquals(NOW, stored.readAt());
    }

    @Test
    void givenUnknownId_whenMarkAsRead_thenNotFound() {
        NotificationException error = assertThrows(NotificationException.class,
                () -> service.markAsRead(CUSTOMER, UUID.randomUUID()));

        assertEquals(NotificationException.Code.NOT_FOUND, error.code());
    }

    @Test
    void givenOtherCustomersNotification_whenMarkAsRead_thenNotFound() {
        PaymentNotification created = service.register(event("PAY-1", NotificationType.PAGO_EXITOSO));

        NotificationException error = assertThrows(NotificationException.class,
                () -> service.markAsRead("CUST-OTHER", created.id()));

        assertEquals(NotificationException.Code.NOT_FOUND, error.code());
        assertNull(repository.store.get(created.id()).readAt());
    }

    @Test
    void givenMixedStatuses_whenListUnread_thenOnlyUnreadAndTotal() {
        PaymentNotification first = service.register(event("PAY-1", NotificationType.PAGO_EXITOSO));
        service.register(event("PAY-2", NotificationType.PAGO_RECHAZADO));
        service.markAsRead(CUSTOMER, first.id());

        PageResult<PaymentNotification> unread = service.list(CUSTOMER, NotificationStatus.UNREAD, 0, 20);
        PageResult<PaymentNotification> all = service.list(CUSTOMER, null, 0, 20);

        assertEquals(1, unread.total());
        assertEquals("PAY-2", unread.items().get(0).paymentReference());
        assertEquals(2, all.total());
    }

    @Test
    void givenInvalidPageSize_whenList_thenInvalid() {
        NotificationException error = assertThrows(NotificationException.class,
                () -> service.list(CUSTOMER, null, 0, 1000));

        assertEquals(NotificationException.Code.INVALID_REQUEST, error.code());
    }

    @Test
    void givenBlankCustomer_whenList_thenInvalid() {
        assertThrows(NotificationException.class, () -> service.list(" ", null, 0, 20));
    }

    /** Doble de prueba del puerto de persistencia. */
    private static final class InMemoryRepository implements NotificationRepository {
        private final Map<UUID, PaymentNotification> store = new LinkedHashMap<>();

        @Override
        public Optional<PaymentNotification> findByIdAndCustomer(UUID id, String customerId) {
            return Optional.ofNullable(store.get(id)).filter(n -> n.customerId().equals(customerId));
        }

        @Override
        public boolean existsByReferenceAndType(String paymentReference, NotificationType type) {
            return store.values().stream()
                    .anyMatch(n -> n.paymentReference().equals(paymentReference) && n.type() == type);
        }

        @Override
        public PaymentNotification save(PaymentNotification notification) {
            store.put(notification.id(), notification);
            return notification;
        }

        @Override
        public List<PaymentNotification> findByCustomer(String customerId, NotificationStatus status,
                                                        int page, int size) {
            return store.values().stream()
                    .filter(n -> n.customerId().equals(customerId))
                    .filter(n -> status == null || n.status() == status)
                    .sorted(Comparator.comparing(PaymentNotification::createdAt).reversed())
                    .skip((long) page * size)
                    .limit(size)
                    .toList();
        }

        @Override
        public long countByCustomer(String customerId, NotificationStatus status) {
            return store.values().stream()
                    .filter(n -> n.customerId().equals(customerId))
                    .filter(n -> status == null || n.status() == status)
                    .count();
        }
    }
}
