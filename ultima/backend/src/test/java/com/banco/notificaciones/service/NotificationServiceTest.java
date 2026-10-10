package com.banco.notificaciones.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banco.notificaciones.domain.Notification;
import com.banco.notificaciones.domain.NotificationType;
import com.banco.notificaciones.port.NotificationRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NotificationServiceTest {

    private static final Instant NOW = Instant.parse("2026-01-15T10:00:00Z");
    private static final String ANA = "cust-ana";
    private static final String LUIS = "cust-luis";

    private InMemoryRepository repository;
    private NotificationService service;

    @BeforeEach
    void setUp() {
        repository = new InMemoryRepository();
        service = new NotificationService(repository, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void givenUnreadAndRead_whenListUnread_thenOnlyUnreadOfCustomerNewestFirst() {
        Notification first = service.create(ANA, input("PAY-1", NotificationType.PAYMENT_SUCCEEDED));
        service.create(ANA, input("PAY-2", NotificationType.PAYMENT_FAILED));
        service.create(LUIS, input("PAY-3", NotificationType.PAYMENT_SUCCEEDED));
        service.markRead(ANA, first.id());

        List<Notification> unread = service.list(ANA, "unread", 20);
        List<Notification> all = service.list(ANA, "all", 20);

        assertEquals(1, unread.size());
        assertEquals("PAY-2", unread.get(0).paymentId());
        assertEquals(2, all.size());
    }

    @Test
    void givenUnreadNotifications_whenCountUnread_thenCountsOnlyCustomerOnes() {
        service.create(ANA, input("PAY-1", NotificationType.PAYMENT_SUCCEEDED));
        service.create(ANA, input("PAY-2", NotificationType.PAYMENT_FAILED));
        service.create(LUIS, input("PAY-3", NotificationType.PAYMENT_SUCCEEDED));

        assertEquals(2, service.unreadCount(ANA));
        assertEquals(1, service.unreadCount(LUIS));
    }

    @Test
    void givenNotification_whenMarkRead_thenReadAtIsSetWithClockTime() {
        Notification created = service.create(ANA, input("PAY-1", NotificationType.PAYMENT_SUCCEEDED));

        service.markRead(ANA, created.id());

        Notification stored = repository.byId(created.id());
        assertNotNull(stored.readAt());
        assertEquals(NOW, stored.readAt());
        assertEquals(0, service.unreadCount(ANA));
    }

    @Test
    void givenNotificationOfAnotherCustomer_whenMarkRead_thenNotFoundAndNotModified() {
        Notification ofAna = service.create(ANA, input("PAY-1", NotificationType.PAYMENT_SUCCEEDED));

        assertThrows(NotificationNotFoundException.class, () -> service.markRead(LUIS, ofAna.id()));

        assertTrue(repository.byId(ofAna.id()).readAt() == null);
    }

    @Test
    void givenUnknownId_whenMarkRead_thenNotFound() {
        assertThrows(NotificationNotFoundException.class, () -> service.markRead(ANA, UUID.randomUUID()));
    }

    @Test
    void givenSamePaymentAndType_whenCreateTwice_thenDuplicateIsRejected() {
        service.create(ANA, input("PAY-1", NotificationType.PAYMENT_SUCCEEDED));

        assertThrows(DuplicateNotificationException.class,
                () -> service.create(ANA, input("PAY-1", NotificationType.PAYMENT_SUCCEEDED)));
    }

    @Test
    void givenSamePaymentDifferentType_whenCreate_thenBothAreStored() {
        service.create(ANA, input("PAY-1", NotificationType.PAYMENT_SCHEDULED));
        service.create(ANA, input("PAY-1", NotificationType.PAYMENT_SUCCEEDED));

        assertEquals(2, service.list(ANA, "all", 20).size());
    }

    @Test
    void givenInvalidStatusOrCustomer_whenCalled_thenIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> service.list(ANA, "other", 20));
        assertThrows(IllegalArgumentException.class, () -> service.list(" ", "all", 20));
        assertThrows(IllegalArgumentException.class, () -> service.unreadCount(null));
    }

    @Test
    void givenHugeOrNegativeLimit_whenList_thenLimitIsClamped() {
        service.list(ANA, "all", 100_000);
        assertEquals(NotificationService.MAX_LIMIT, repository.lastLimit);

        service.list(ANA, "all", -5);
        assertEquals(1, repository.lastLimit);
    }

    private static NewNotification input(String paymentId, NotificationType type) {
        return new NewNotification(paymentId, type, "Pago", "Detalle del pago",
                new BigDecimal("10.50"), "USD", "1234");
    }

    /** Doble en memoria del puerto: el dominio se prueba sin base de datos. */
    private static final class InMemoryRepository implements NotificationRepository {
        private final List<Notification> store = new ArrayList<>();
        int lastLimit;

        @Override
        public List<Notification> findByCustomer(String customerId, boolean unreadOnly, int limit) {
            lastLimit = limit;
            return store.stream()
                    .filter(n -> n.customerId().equals(customerId))
                    .filter(n -> !unreadOnly || !n.isRead())
                    .sorted(Comparator.comparing(Notification::createdAt).reversed())
                    .limit(limit)
                    .toList();
        }

        @Override
        public long countUnread(String customerId) {
            return store.stream().filter(n -> n.customerId().equals(customerId) && !n.isRead()).count();
        }

        @Override
        public boolean markRead(String customerId, UUID id, Instant readAt) {
            for (int i = 0; i < store.size(); i++) {
                Notification n = store.get(i);
                if (n.id().equals(id) && n.customerId().equals(customerId)) {
                    Instant at = n.readAt() != null ? n.readAt() : readAt;
                    store.set(i, new Notification(n.id(), n.customerId(), n.paymentId(), n.type(), n.title(),
                            n.message(), n.amount(), n.currency(), n.accountLast4(), n.createdAt(), at));
                    return true;
                }
            }
            return false;
        }

        @Override
        public boolean insertIfAbsent(Notification notification) {
            boolean exists = store.stream().anyMatch(n ->
                    n.paymentId().equals(notification.paymentId()) && n.type() == notification.type());
            if (exists) {
                return false;
            }
            store.add(notification);
            return true;
        }

        Notification byId(UUID id) {
            return store.stream().filter(n -> n.id().equals(id)).findFirst().orElseThrow();
        }
    }
}
