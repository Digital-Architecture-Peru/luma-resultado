package com.banca.notificaciones.notification.repository;

import com.banca.notificaciones.notification.domain.NotificationPreference;
import com.banca.notificaciones.notification.domain.NotificationType;
import com.banca.notificaciones.notification.domain.PreferenceId;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class JpaPreferenceRepository implements PreferenceRepository {

    private static final String BY_ACCOUNT =
            "select p from NotificationPreference p where p.accountId = :accountId";

    private final EntityManager em;

    @Inject
    public JpaPreferenceRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public List<NotificationPreference> findByAccount(String accountId) {
        return em.createQuery(BY_ACCOUNT, NotificationPreference.class)
                .setParameter("accountId", accountId)
                .getResultList();
    }

    @Override
    public Optional<NotificationPreference> find(String accountId, NotificationType type) {
        return Optional.ofNullable(em.find(NotificationPreference.class, new PreferenceId(accountId, type)));
    }

    @Override
    public void save(NotificationPreference preference) {
        em.merge(preference);
    }
}
