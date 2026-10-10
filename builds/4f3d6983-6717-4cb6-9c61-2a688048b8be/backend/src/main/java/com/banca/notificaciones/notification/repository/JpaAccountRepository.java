package com.banca.notificaciones.notification.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class JpaAccountRepository implements AccountRepository {

    private static final String EXISTS_SQL = "select count(*) from account where id = :id";

    private final EntityManager em;

    @Inject
    public JpaAccountRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public boolean exists(String accountId) {
        Number count = (Number) em.createNativeQuery(EXISTS_SQL)
                .setParameter("id", accountId)
                .getSingleResult();
        return count.longValue() > 0;
    }
}
