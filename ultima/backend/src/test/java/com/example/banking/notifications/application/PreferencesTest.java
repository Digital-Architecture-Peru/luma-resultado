package com.example.banking.notifications.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.banking.notifications.application.Fakes.FakeOwnership;
import com.example.banking.notifications.application.Fakes.InMemoryPreferences;
import com.example.banking.notifications.domain.Channel;
import com.example.banking.notifications.domain.DomainException;
import com.example.banking.notifications.domain.NotificationType;
import com.example.banking.notifications.domain.Preference;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PreferencesTest {

    private InMemoryPreferences repo;
    private UpdatePreferences update;
    private GetPreferences get;

    @BeforeEach
    void setUp() {
        repo = new InMemoryPreferences();
        update = new UpdatePreferences(repo, new FakeOwnership());
        get = new GetPreferences(repo, new FakeOwnership());
    }

    private static Preference pref(String account, NotificationType t, boolean enabled, String threshold) {
        return new Preference(account, t, Channel.IN_APP, enabled, threshold == null ? null : new BigDecimal(threshold));
    }

    @Test
    void givenValidPreferences_whenUpdate_thenReplacedAndReadable() {
        update.execute("cust-001", "acc-001", List.of(
                pref("acc-001", NotificationType.CREDIT, true, null),
                pref("acc-001", NotificationType.LOW_BALANCE, false, "150.00")));

        List<Preference> stored = get.execute("cust-001", "acc-001");

        assertEquals(2, stored.size());
        assertEquals(new BigDecimal("150.00"), stored.get(1).thresholdAmount());
    }

    @Test
    void givenForeignAccount_whenUpdate_thenAccessDenied() {
        assertThrows(DomainException.AccessDenied.class, () -> update.execute("cust-001", "acc-003",
                List.of(pref("acc-003", NotificationType.CREDIT, true, null))));
        assertThrows(DomainException.AccessDenied.class, () -> get.execute("cust-001", "acc-003"));
    }

    @Test
    void givenNegativeThreshold_whenCreatePreference_thenInvalidRequest() {
        assertThrows(DomainException.InvalidRequest.class,
                () -> pref("acc-001", NotificationType.LOW_BALANCE, true, "-1"));
    }

    @Test
    void givenDuplicatedTypeAndChannel_whenUpdate_thenInvalidRequest() {
        assertThrows(DomainException.InvalidRequest.class, () -> update.execute("cust-001", "acc-001", List.of(
                pref("acc-001", NotificationType.CREDIT, true, null),
                pref("acc-001", NotificationType.CREDIT, false, null))));
    }

    @Test
    void givenPreferenceOfOtherAccount_whenUpdate_thenInvalidRequest() {
        assertThrows(DomainException.InvalidRequest.class, () -> update.execute("cust-001", "acc-001",
                List.of(pref("acc-003", NotificationType.CREDIT, true, null))));
    }
}
