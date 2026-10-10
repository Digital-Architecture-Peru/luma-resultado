package com.example.cuentas.notificaciones.application;

import com.example.cuentas.notificaciones.domain.Preference;
import com.example.cuentas.notificaciones.domain.ports.PreferenceRepository;
import java.math.BigDecimal;
import java.time.Clock;
import org.springframework.stereotype.Service;

@Service
public class PreferenceService {

    private final PreferenceRepository preferences;
    private final Clock clock;

    public PreferenceService(PreferenceRepository preferences, Clock clock) {
        this.preferences = preferences;
        this.clock = clock;
    }

    public Preference get(String accountId) {
        return preferences.find(accountId)
                .orElseGet(() -> Preference.defaults(accountId, clock.instant()));
    }

    public Preference update(String accountId, BigDecimal threshold,
                             boolean depositEnabled, boolean withdrawalEnabled) {
        if (threshold == null || threshold.signum() < 0) {
            throw new IllegalArgumentException("El umbral de saldo bajo debe ser >= 0");
        }
        Preference updated = new Preference(accountId, threshold, depositEnabled,
                withdrawalEnabled, clock.instant());
        return preferences.save(updated);
    }
}
