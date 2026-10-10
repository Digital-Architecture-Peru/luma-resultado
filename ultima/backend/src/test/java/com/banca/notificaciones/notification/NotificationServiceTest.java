package com.banca.notificaciones.notification;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banca.notificaciones.notification.channel.NotificationChannel;
import com.banca.notificaciones.notification.domain.DomainException;
import com.banca.notificaciones.notification.domain.Notification;
import com.banca.notificaciones.notification.domain.NotificationPreference;
import com.banca.notificaciones.notification.domain.NotificationType;
import com.banca.notificaciones.notification.domain.Page;
import com.banca.notificaciones.notification.domain.PreferenceUpdate;
import com.banca.notificaciones.notification.repository.AccountRepository;
import com.banca.notificaciones.notification.repository.NotificationRepository;
import com.banca.notificaciones.notification.repository.PreferenceRepository;
import com.banca.notificaciones.notification.service.NotificationService;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NotificationServiceTest {

    private static final Instant NOW = Instant.parse("2026-10-09T12:00:00Z");
    private static final String ACCOUNT = "ACC-001";

    private InMemoryNotifications notifications;
    private InMemoryPreferences preferences;
    private RecordingChannel channel;
    private NotificationService service;

    @BeforeEach
    void setUp() {
        notifications = new InMemoryNotifications();
        preferences = new InMemoryPreferences();
        channel = new RecordingChannel();
        AccountRepository accounts = id -> Set.of(ACCOUNT).contains(id);
        service = new NotificationService(notifications, preferences, accounts, channel,
                Clock.fixed(NOW, ZoneOffset.UTC));
    }

    private Notification seed(NotificationType type, Instant createdAt, boolean read) {
        Notification n = Notification.create(UUID.randomUUID(), ACCOUNT, type, "Título", "Cuerpo",
                new BigDecimal("10.00"), "USD", createdAt);
        if (read) {
            n.markRead(createdAt.plusSeconds(60));
        }
        notifications.save(n);
        return n;
    }

    @Test
    void givenUnreadNotification_whenMarkRead_thenReadAtIsSetAndPersisted() {
        Notification n = seed(NotificationType.DEPOSIT, NOW.minusSeconds(3600), false);

        Notification result = service.markRead(n.getId().toString());

        assertEquals(NOW, result.getReadAt());
        assertEquals(NOW, notifications.findById(n.getId()).orElseThrow().getReadAt());
    }

    @Test
    void givenAlreadyReadNotification_whenMarkRead_thenConflict409() {
        Notification n = seed(NotificationType.DEPOSIT, NOW.minusSeconds(3600), true);

        DomainException ex = assertThrows(DomainException.class, () -> service.markRead(n.getId().toString()));

        assertEquals(409, ex.getStatus());
    }

    @Test
    void givenUnknownNotification_whenMarkRead_thenNotFound404() {
        DomainException ex = assertThrows(DomainException.class,
                () -> service.markRead(UUID.randomUUID().toString()));

        assertEquals(404, ex.getStatus());
    }

    @Test
    void givenMalformedId_whenMarkRead_thenBadRequest400() {
        DomainException ex = assertThrows(DomainException.class, () -> service.markRead("no-es-uuid"));

        assertEquals(400, ex.getStatus());
    }

    @Test
    void givenMixedNotifications_whenListUnread_thenOnlyUnreadNewestFirst() {
        Notification older = seed(NotificationType.DEPOSIT, NOW.minusSeconds(7200), false);
        Notification newer = seed(NotificationType.LOW_BALANCE, NOW.minusSeconds(60), false);
        seed(NotificationType.WITHDRAWAL, NOW.minusSeconds(3600), true);

        Page<Notification> page = service.list(ACCOUNT, true, 0, 10);

        assertEquals(2, page.total());
        assertEquals(List.of(newer.getId(), older.getId()),
                page.items().stream().map(Notification::getId).toList());
    }

    @Test
    void givenManyNotifications_whenListSecondPage_thenReturnsRemainder() {
        for (int i = 0; i < 3; i++) {
            seed(NotificationType.DEPOSIT, NOW.minusSeconds(100L * (i + 1)), false);
        }

        Page<Notification> page = service.list(ACCOUNT, false, 1, 2);

        assertEquals(3, page.total());
        assertEquals(1, page.items().size());
    }

    @Test
    void givenUnknownAccount_whenList_thenNotFound404() {
        DomainException ex = assertThrows(DomainException.class, () -> service.list("NOPE", false, 0, 10));

        assertEquals(404, ex.getStatus());
    }

    @Test
    void givenInvalidPaging_whenList_thenBadRequest400() {
        assertEquals(400, assertThrows(DomainException.class, () -> service.list(ACCOUNT, false, -1, 10)).getStatus());
        assertEquals(400, assertThrows(DomainException.class, () -> service.list(ACCOUNT, false, 0, 0)).getStatus());
        assertEquals(400, assertThrows(DomainException.class, () -> service.list(ACCOUNT, false, 0, 101)).getStatus());
    }

    @Test
    void givenNoStoredPreferences_whenGetPreferences_thenDefaultsForEveryType() {
        List<NotificationPreference> result = service.getPreferences(ACCOUNT);

        assertEquals(NotificationType.values().length, result.size());
        assertTrue(result.stream().allMatch(NotificationPreference::isEnabled));
    }

    @Test
    void givenLowBalanceEnabledWithoutThreshold_whenUpdate_thenBadRequest400() {
        DomainException ex = assertThrows(DomainException.class, () -> service.updatePreferences(ACCOUNT,
                List.of(new PreferenceUpdate(NotificationType.LOW_BALANCE, true, null))));

        assertEquals(400, ex.getStatus());
    }

    @Test
    void givenNegativeThreshold_whenUpdate_thenBadRequest400() {
        DomainException ex = assertThrows(DomainException.class, () -> service.updatePreferences(ACCOUNT,
                List.of(new PreferenceUpdate(NotificationType.LOW_BALANCE, true, new BigDecimal("-1")))));

        assertEquals(400, ex.getStatus());
    }

    @Test
    void givenValidUpdate_whenUpdatePreferences_thenPersistedAndReturned() {
        List<NotificationPreference> result = service.updatePreferences(ACCOUNT, List.of(
                new PreferenceUpdate(NotificationType.LOW_BALANCE, true, new BigDecimal("75.00")),
                new PreferenceUpdate(NotificationType.DEPOSIT, false, null)));

        NotificationPreference low = result.stream()
                .filter(p -> p.getType() == NotificationType.LOW_BALANCE).findFirst().orElseThrow();
        NotificationPreference deposit = result.stream()
                .filter(p -> p.getType() == NotificationType.DEPOSIT).findFirst().orElseThrow();
        assertEquals(new BigDecimal("75.00"), low.getThreshold());
        assertFalse(deposit.isEnabled());
    }

    @Test
    void givenDisabledType_whenNotify_thenNothingIsDelivered() {
        service.updatePreferences(ACCOUNT, List.of(new PreferenceUpdate(NotificationType.DEPOSIT, false, null)));

        Optional<Notification> result = service.notify(ACCOUNT, NotificationType.DEPOSIT, "t", "b",
                new BigDecimal("5.00"), "USD");

        assertTrue(result.isEmpty());
        assertTrue(channel.delivered.isEmpty());
    }

    @Test
    void givenEnabledType_whenNotify_thenDeliveredThroughChannel() {
        Optional<Notification> result = service.notify(ACCOUNT, NotificationType.WITHDRAWAL, "Retiro", "Detalle",
                new BigDecimal("20.00"), "USD");

        assertTrue(result.isPresent());
        assertEquals(1, channel.delivered.size());
        assertNotNull(channel.delivered.get(0).getCreatedAt());
        assertEquals(NOW, channel.delivered.get(0).getCreatedAt());
    }

    // ---- dobles en memoria ----

    private static class InMemoryNotifications implements NotificationRepository {
        private final List<Notification> store = new ArrayList<>();

        private List<Notification> filtered(String accountId, boolean unreadOnly) {
            return store.stream()
                    .filter(n -> n.getAccountId().equals(accountId))
                    .filter(n -> !unreadOnly || n.getReadAt() == null)
                    .sorted(Comparator.comparing(Notification::getCreatedAt).reversed())
                    .toList();
        }

        @Override
        public List<Notification> findByAccount(String accountId, boolean unreadOnly, int page, int size) {
            return filtered(accountId, unreadOnly).stream().skip((long) page * size).limit(size).toList();
        }

        @Override
        public long countByAccount(String accountId, boolean unreadOnly) {
            return filtered(accountId, unreadOnly).size();
        }

        @Override
        public Optional<Notification> findById(UUID id) {
            return store.stream().filter(n -> n.getId().equals(id)).findFirst();
        }

        @Override
        public void save(Notification notification) {
            store.removeIf(n -> n.getId().equals(notification.getId()));
            store.add(notification);
        }
    }

    private static class InMemoryPreferences implements PreferenceRepository {
        private final List<NotificationPreference> store = new ArrayList<>();

        @Override
        public List<NotificationPreference> findByAccount(String accountId) {
            return store.stream().filter(p -> p.getAccountId().equals(accountId)).toList();
        }

        @Override
        public Optional<NotificationPreference> find(String accountId, NotificationType type) {
            return store.stream()
                    .filter(p -> p.getAccountId().equals(accountId) && p.getType() == type)
                    .findFirst();
        }

        @Override
        public void save(NotificationPreference preference) {
            store.removeIf(p -> p.getAccountId().equals(preference.getAccountId())
                    && p.getType() == preference.getType());
            store.add(preference);
        }
    }

    private static class RecordingChannel implements NotificationChannel {
        private final List<Notification> delivered = new ArrayList<>();

        @Override
        public void deliver(Notification notification) {
            delivered.add(notification);
        }
    }
}
