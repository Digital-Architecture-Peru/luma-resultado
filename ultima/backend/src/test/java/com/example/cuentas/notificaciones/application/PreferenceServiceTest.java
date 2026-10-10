package com.example.cuentas.notificaciones.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.cuentas.notificaciones.domain.Preference;
import com.example.cuentas.notificaciones.domain.ports.PreferenceRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PreferenceServiceTest {

    private static final Instant NOW = Instant.parse("2026-01-15T10:00:00Z");
    private static final String ACCOUNT = "10001234";

    private PreferenceRepository repository;
    private PreferenceService service;

    @BeforeEach
    void setUp() {
        repository = mock(PreferenceRepository.class);
        service = new PreferenceService(repository, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void givenNoStoredPreference_whenGet_thenReturnsDefaults() {
        when(repository.find(ACCOUNT)).thenReturn(Optional.empty());

        Preference result = service.get(ACCOUNT);

        assertEquals(new BigDecimal("100.00"), result.lowBalanceThreshold());
        assertTrue(result.depositEnabled());
        assertTrue(result.withdrawalEnabled());
    }

    @Test
    void givenNegativeThreshold_whenUpdate_thenThrowsIllegalArgument() {
        assertThrows(IllegalArgumentException.class,
                () -> service.update(ACCOUNT, new BigDecimal("-1"), true, true));
    }

    @Test
    void givenValidValues_whenUpdate_thenSavesWithCurrentTimestamp() {
        when(repository.save(org.mockito.ArgumentMatchers.any(Preference.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Preference result = service.update(ACCOUNT, new BigDecimal("250.00"), false, true);

        assertEquals(NOW, result.updatedAt());
        assertEquals(new BigDecimal("250.00"), result.lowBalanceThreshold());
        verify(repository).save(result);
    }
}
