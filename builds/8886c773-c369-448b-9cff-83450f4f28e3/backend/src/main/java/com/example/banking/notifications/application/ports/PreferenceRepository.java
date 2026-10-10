package com.example.banking.notifications.application.ports;

import com.example.banking.notifications.domain.Preference;
import java.util.List;

public interface PreferenceRepository {

    List<Preference> findByAccount(String accountId);

    /** Reemplaza de forma atómica todas las preferencias de la cuenta. */
    void replaceAll(String accountId, List<Preference> preferences);
}
