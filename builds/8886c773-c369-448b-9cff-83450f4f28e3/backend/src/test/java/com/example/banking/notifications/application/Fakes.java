package com.example.banking.notifications.application;

import com.example.banking.notifications.application.ports.AccountOwnership;
import com.example.banking.notifications.application.ports.NotificationRepository;
import com.example.banking.notifications.application.ports.PreferenceRepository;
import com.example.banking.notifications.domain.Notification;
import com.example.banking.notifications.domain.NotificationStatus;
import com.example.banking.notifications.domain.Preference;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/** Dobles en memoria para probar casos de uso sin base de datos. */
final class Fakes {

    private Fakes() {
    }

    static final class InMemoryNotifications implements NotificationRepository {
        final Map<UUID, Notification> store = new HashMap<>();
        int saves;

        @Override
        public List<Notification> findByAccount(String accountId, Optional<NotificationStatus> status,
                                                int page, int size) {
            return store.values().stream()
                    .filter(n -> n.accountId().equals(accountId))
                    .filter(n -> status.map(s -> s == n.status()).orElse(true))
                    .sorted(Comparator.comparing(Notification::createdAt).reversed())
                    .skip((long) page * size).limit(size).toList();
        }

        @Override
        public Optional<Notification> findById(UUID id) {
            return Optional.ofNullable(store.get(id));
        }

        @Override
        public void save(Notification n) {
            saves++;
            store.put(n.id(), n);
        }
    }

    static final class InMemoryPreferences implements PreferenceRepository {
        final Map<String, List<Preference>> store = new HashMap<>();

        @Override
        public List<Preference> findByAccount(String accountId) {
            return store.getOrDefault(accountId, List.of());
        }

        @Override
        public void replaceAll(String accountId, List<Preference> preferences) {
            store.put(accountId, new ArrayList<>(preferences));
        }
    }

    /** cust-001 es titular de acc-001; cust-002 de acc-003. */
    static final class FakeOwnership implements AccountOwnership {
        @Override
        public boolean isOwner(String customerId, String accountId) {
            return ("cust-001".equals(customerId) && "acc-001".equals(accountId))
                    || ("cust-002".equals(customerId) && "acc-003".equals(accountId));
        }
    }
}
