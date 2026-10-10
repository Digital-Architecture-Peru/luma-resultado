package com.example.cuentas.notificaciones.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.Instant;
import org.junit.jupiter.api.Test;

class DomainTest {

    private static final Instant NOW = Instant.parse("2026-01-15T10:00:00Z");

    @Test
    void givenLongAccount_whenMask_thenOnlyLastFourVisible() {
        assertEquals("****1234", AccountMask.mask("10001234"));
    }

    @Test
    void givenShortOrBlankAccount_whenMask_thenDoesNotFail() {
        assertEquals("****12", AccountMask.mask("12"));
        assertEquals("****", AccountMask.mask(" "));
        assertEquals("****", AccountMask.mask(null));
    }

    @Test
    void givenThreshold_whenLowBalanceEqualsThreshold_thenAllowed() {
        Preference p = Preference.defaults("10001234", NOW);

        assertTrue(p.allows(NotificationType.LOW_BALANCE, new BigDecimal("100.00")));
        assertFalse(p.allows(NotificationType.LOW_BALANCE, new BigDecimal("100.01")));
        assertFalse(p.allows(NotificationType.LOW_BALANCE, null));
    }

    @Test
    void givenWithdrawalDisabled_whenAllows_thenFalseOnlyForWithdrawal() {
        Preference p = new Preference("10001234", BigDecimal.TEN, true, false, NOW);

        assertFalse(p.allows(NotificationType.WITHDRAWAL, BigDecimal.ONE));
        assertTrue(p.allows(NotificationType.DEPOSIT, BigDecimal.ONE));
    }

    @Test
    void givenUnreadNotification_whenMarkRead_thenReturnsReadCopy() {
        Notification n = new Notification(java.util.UUID.randomUUID(), "10001234",
                NotificationType.DEPOSIT, "x", BigDecimal.ONE, null, NOW);

        Notification read = n.markRead(NOW.plusSeconds(5));

        assertFalse(n.isRead());
        assertTrue(read.isRead());
    }
}
