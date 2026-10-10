package com.example.banca.notification.adapters.out.persistence;

import com.example.banca.notification.domain.Preference;
import com.example.banca.notification.domain.PreferenceRepository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

interface JpaPreferenceRepository extends JpaRepository<PreferenceEntity, PreferenceEntity.Key> {

    List<PreferenceEntity> findByCustomerId(String customerId);
}

@Repository
class PreferenceRepositoryAdapter implements PreferenceRepository {

    private final JpaPreferenceRepository jpa;

    PreferenceRepositoryAdapter(JpaPreferenceRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public List<Preference> findByCustomer(String customerId) {
        return jpa.findByCustomerId(customerId).stream()
                .map(e -> new Preference(e.eventType(), e.channel(), e.enabled()))
                .toList();
    }

    @Override
    public void save(String customerId, Preference preference) {
        jpa.save(new PreferenceEntity(customerId, preference.eventType(), preference.channel(),
                preference.enabled()));
    }
}
