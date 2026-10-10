package com.example.cuentas.notificaciones.domain.ports;

import com.example.cuentas.notificaciones.domain.Preference;
import java.util.Optional;

public interface PreferenceRepository {

    Optional<Preference> find(String accountId);

    Preference save(Preference preference);
}
