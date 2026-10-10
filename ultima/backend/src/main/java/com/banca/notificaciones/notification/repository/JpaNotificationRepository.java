package com.banca.notificaciones.notification.repository;

import com.banca.notificaciones.notification.domain.Notification;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Adaptador JPA; todas las consultas usan parámetros nombrados. */
@ApplicationScoped
public class JpaNotificationRepository implements NotificationRepository {

    private static final String ALL_QUERY =
            "select n from Notification n where n.accountId = :accountId order by n.createdAt desc";
    private static final String UNREAD_QUERY =
            "select n from Notification n where n.accountId = :accountId and n.readAt is null "
                    + "order by n.createdAt desc";
    private static final String COUNT_ALL =
            "select count(n) from Notification n where n.accountId = :accountId";
    private static final String COUNT_UNREAD =
            "select count(n) from Notification n where n.accountId = :accountId and n.readAt is null";

    private final EntityManager em;

    @Inject
    public JpaNotificationRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public List<Notification> findByAccount(String accountId, boolean unreadOnly, int page, int size) {
        int offset = (int) Math.min((long) page * size, Integer.MAX_VALUE);
        return em.createQuery(unreadOnly ? UNREAD_QUERY : ALL_QUERY, Notification.class)
                .setParameter("accountId", accountId)
                .setFirstResult(offset)
                .setMaxResults(size)
                .getResultList();
    }

    @Override
    public long countByAccount(String accountId, boolean unreadOnly) {
        return em.createQuery(unreadOnly ? COUNT_UNREAD : COUNT_ALL, Long.class)
                .setParameter("accountId", accountId)
                .getSingleResult();
    }

    @Override
    public Optional<Notification> findById(UUID id) {
        return Optional.ofNullable(em.find(Notification.class, id));
    }

    @Override
    public void save(Notification notification) {
        em.merge(notification);
    }
}
