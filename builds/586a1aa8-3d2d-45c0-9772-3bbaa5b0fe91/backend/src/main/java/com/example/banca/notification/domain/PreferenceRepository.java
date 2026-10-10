package com.example.banca.notification.domain;

import java.util.List;

/** Puerto de persistencia de preferencias. */
public interface PreferenceRepository {

    List<Preference> findByCustomer(String customerId);

    void save(String customerId, Preference preference);
}
