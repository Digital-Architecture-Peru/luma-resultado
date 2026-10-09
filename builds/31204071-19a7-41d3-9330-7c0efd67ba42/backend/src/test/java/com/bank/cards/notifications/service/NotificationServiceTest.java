package com.bank.cards.notifications.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bank.cards.notifications.domain.CardNotification;
import com.bank.cards.notifications.domain.NotificationType;
import com.bank.cards.notifications.domain.PageResult;
import com.bank.cards.notifications.domain.Preference;
import com.bank.cards.notifications.port.CardOwnershipPort;
import com.bank.cards.notifications.port.NotificationRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NotificationServiceTest {

    private static final String CUSTOMER = "cust-test";
    private static final UUID CARD = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final UUID OTHER_CARD = UUID.fromString("33333333-3333-4333-8333-333333333333");
    private static final Instant NOW = Instant.parse("2026-10-09T12:00:00Z");

    private static final UUID UNREAD_ID = UUID.fromString("a0000000-0000-4000-8000-0000000000a1");
    private static final UUID READ_ID = UUID.fromString("a0000000-0000-4000-8000-0000000000a2");
    private static final UUID FOREIGN_ID = UUID.fromString("a0000000-0000-4000-8000-0000000000a3");

    private InMemoryRepository repository;
    private NotificationService service;

    @BeforeEach
    void setUp() {
        repository = new InMemoryRepository();
        repository.add(notification(UNREAD_ID, CARD, NotificationType.PURCHASE, null, NOW.minusSeconds(60)));
        repository.add(notification(READ_ID, CARD, NotificationType.PAYMENT_DUE, NOW.minusSeconds(3000),
                NOW.minusSeconds(7200)));
        repository.add(notification(FOREIGN_ID, OTHER_CARD, NotificationType.PURCHASE, null, NOW.minusSeconds(10)));
        CardOwnershipPort ownership = (customer, card) -> CUSTOMER.equals(customer) && CARD.equals(card);
        service = new NotificationService(repository, ownership, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void givenOwner_whenList_thenReturnsNewestFirstOnlyForThatCard() {
        PageResult<CardNotification> page = service.list(CUSTOMER, CARD, false, 0, 20);

        assertEquals(2, page.total());
        assertEquals(List.of(UNREAD_ID, READ_ID), page.items().stream().map(CardNotification::id).toList());
    }

    @Test
    void givenUnreadFilter_whenList_thenOnlyUnreadAreReturned() {
        PageResult<CardNotification> page = service.list(CUSTOMER, CARD, true, 0, 20);

        assertEquals(1, page.total());
        assertEquals(UNREAD_ID, page.items().get(0).id());
    }

    @Test
    void givenSmallPageSize_whenList_thenPaginates() {
        PageResult<CardNotification> second = service.list(CUSTOMER, CARD, false, 1, 1);

        assertEquals(2, second.total());
        assertEquals(List.of(READ_ID), second.items().stream().map(CardNotification::id).toList());
    }

    @Test
    void givenCardOfAnotherCustomer_whenList_thenAccessDenied() {
        assertThrows(DomainException.AccessDenied.class, () -> service.list(CUSTOMER, OTHER_CARD, false, 0, 20));
        assertThrows(DomainException.AccessDenied.class, () -> service.list("otro-cliente", CARD, false, 0, 20));
    }

    @Test
    void givenMissingCustomer_whenList_thenUnauthenticated() {
        assertThrows(DomainException.Unauthenticated.class, () -> service.list(null, CARD, false, 0, 20));
        assertThrows(DomainException.Unauthenticated.class, () -> service.list("  ", CARD, false, 0, 20));
    }

    @Test
    void givenInvalidPaging_whenList_thenInvalidRequest() {
        assertThrows(DomainException.InvalidRequest.class, () -> service.list(CUSTOMER, CARD, false, -1, 20));
        assertThrows(DomainException.InvalidRequest.class, () -> service.list(CUSTOMER, CARD, false, 0, 0));
        assertThrows(DomainException.InvalidRequest.class,
                () -> service.list(CUSTOMER, CARD, false, 0, NotificationService.MAX_PAGE_SIZE + 1));
    }

    @Test
    void givenUnreadNotification_whenMarkRead_thenReadAtIsClockInstant() {
        CardNotification result = service.markRead(CUSTOMER, UNREAD_ID);

        assertTrue(result.isRead());
        assertEquals(NOW, result.readAt());
    }

    @Test
    void givenReadNotification_whenMarkRead_thenKeepsOriginalReadAt() {
        Instant original = repository.findById(READ_ID).orElseThrow().readAt();

        CardNotification result = service.markRead(CUSTOMER, READ_ID);

        assertEquals(original, result.readAt());
        assertEquals(0, repository.markReadCalls(READ_ID));
    }

    @Test
    void givenNotificationOfAnotherCard_whenMarkRead_thenNotFound() {
        assertThrows(DomainException.NotFound.class, () -> service.markRead(CUSTOMER, FOREIGN_ID));
        assertFalse(repository.findById(FOREIGN_ID).orElseThrow().isRead());
    }

    @Test
    void givenUnknownId_whenMarkRead_thenNotFound() {
        assertThrows(DomainException.NotFound.class, () -> service.markRead(CUSTOMER, UUID.randomUUID()));
    }

    @Test
    void givenNoStoredPreferences_whenGet_thenAllTypesAreEnabled() {
        List<Preference> preferences = service.getPreferences(CUSTOMER, CARD);

        assertEquals(NotificationType.values().length, preferences.size());
        assertTrue(preferences.stream().allMatch(Preference::enabled));
    }

    @Test
    void givenUpdate_whenSave_thenReturnsMergedPreferences() {
        List<Preference> result = service.updatePreferences(CUSTOMER, CARD,
                List.of(new Preference(NotificationType.LIMIT_REACHED, false)));

        Map<NotificationType, Boolean> byType = new EnumMap<>(NotificationType.class);
        result.forEach(p -> byType.put(p.type(), p.enabled()));
        assertFalse(byType.get(NotificationType.LIMIT_REACHED));
        assertTrue(byType.get(NotificationType.PURCHASE));
    }

    @Test
    void givenDuplicatedOrEmptyPreferences_whenUpdate_thenInvalidRequest() {
        List<Preference> duplicated = List.of(
                new Preference(NotificationType.PURCHASE, true), new Preference(NotificationType.PURCHASE, false));

        assertThrows(DomainException.InvalidRequest.class, () -> service.updatePreferences(CUSTOMER, CARD, duplicated));
        assertThrows(DomainException.InvalidRequest.class, () -> service.updatePreferences(CUSTOMER, CARD, List.of()));
        assertThrows(DomainException.InvalidRequest.class, () -> service.updatePreferences(CUSTOMER, CARD, null));
    }

    @Test
    void givenCardOfAnotherCustomer_whenUpdatePreferences_thenAccessDenied() {
        assertThrows(DomainException.AccessDenied.class, () -> service.updatePreferences(CUSTOMER, OTHER_CARD,
                List.of(new Preference(NotificationType.PURCHASE, false))));
    }

    private static CardNotification notification(
            UUID id, UUID cardId, NotificationType type, Instant readAt, Instant createdAt) {
        return new CardNotification(id, cardId, "4242", type, "Aviso", "Mensaje de prueba",
                new BigDecimal("10.00"), readAt, createdAt);
    }

    /** Doble en memoria del puerto de persistencia: permite probar el servicio sin PostgreSQL. */
    private static final class InMemoryRepository implements NotificationRepository {

        private final Map<UUID, CardNotification> notifications = new LinkedHashMap<>();
        private final Map<UUID, Map<NotificationType, Boolean>> preferences = new LinkedHashMap<>();
        private final Map<UUID, Integer> markReadCalls = new LinkedHashMap<>();

        void add(CardNotification notification) {
            notifications.put(notification.id(), notification);
        }

        int markReadCalls(UUID id) {
            return markReadCalls.getOrDefault(id, 0);
        }

        @Override
        public PageResult<CardNotification> findByCard(UUID cardId, boolean unreadOnly, int page, int size) {
            List<CardNotification> matching = new ArrayList<>(notifications.values().stream()
                    .filter(n -> n.cardId().equals(cardId))
                    .filter(n -> !unreadOnly || !n.isRead())
                    .sorted(Comparator.comparing(CardNotification::createdAt).reversed())
                    .toList());
            int from = Math.min(page * size, matching.size());
            int to = Math.min(from + size, matching.size());
            return new PageResult<>(matching.subList(from, to), page, size, matching.size());
        }

        @Override
        public Optional<CardNotification> findById(UUID id) {
            return Optional.ofNullable(notifications.get(id));
        }

        @Override
        public void markRead(UUID id, Instant readAt) {
            markReadCalls.merge(id, 1, Integer::sum);
            notifications.computeIfPresent(id, (key, n) -> n.isRead() ? n : n.withReadAt(readAt));
        }

        @Override
        public List<Preference> findPreferences(UUID cardId) {
            return preferences.getOrDefault(cardId, new EnumMap<>(NotificationType.class)).entrySet().stream()
                    .map(e -> new Preference(e.getKey(), e.getValue()))
                    .toList();
        }

        @Override
        public void savePreferences(UUID cardId, List<Preference> toSave) {
            Map<NotificationType, Boolean> stored =
                    preferences.computeIfAbsent(cardId, key -> new EnumMap<>(NotificationType.class));
            toSave.forEach(p -> stored.put(p.type(), p.enabled()));
        }
    }
}
