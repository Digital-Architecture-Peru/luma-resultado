package com.banca.pagos.notification.adapter;

import com.banca.pagos.notification.domain.NotificationStatus;
import com.banca.pagos.notification.domain.NotificationType;
import com.banca.pagos.notification.domain.PaymentNotification;
import com.banca.pagos.notification.port.NotificationRepository;
import com.banca.pagos.notification.service.NotificationException;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Adaptador Panache. Todas las consultas usan parámetros nombrados. */
@ApplicationScoped
public class PanacheNotificationRepository implements NotificationRepository {

    private static final String BY_CUSTOMER = "customerId = :customerId";
    private static final String BY_CUSTOMER_STATUS = "customerId = :customerId and status = :status";
    private static final String NEWEST_FIRST = " order by createdAt desc";

    @Override
    public Optional<PaymentNotification> findByIdAndCustomer(UUID id, String customerId) {
        return PaymentNotificationEntity
                .<PaymentNotificationEntity>find("id = :id and customerId = :customerId",
                        Parameters.with("id", id).and("customerId", customerId))
                .firstResultOptional()
                .map(PanacheNotificationRepository::toDomain);
    }

    @Override
    public boolean existsByReferenceAndType(String paymentReference, NotificationType type) {
        return PaymentNotificationEntity.count("paymentReference = :ref and type = :type",
                Parameters.with("ref", paymentReference).and("type", type)) > 0;
    }

    @Override
    @Transactional
    public PaymentNotification save(PaymentNotification notification) {
        try {
            PaymentNotificationEntity merged =
                    PaymentNotificationEntity.getEntityManager().merge(toEntity(notification));
            PaymentNotificationEntity.flush();
            return toDomain(merged);
        } catch (PersistenceException e) {
            throw NotificationException.duplicate(notification.paymentReference(), notification.type());
        }
    }

    @Override
    public List<PaymentNotification> findByCustomer(String customerId, NotificationStatus status, int page, int size) {
        PanacheQuery<PaymentNotificationEntity> query = status == null
                ? PaymentNotificationEntity.find(BY_CUSTOMER + NEWEST_FIRST,
                        Parameters.with("customerId", customerId))
                : PaymentNotificationEntity.find(BY_CUSTOMER_STATUS + NEWEST_FIRST,
                        Parameters.with("customerId", customerId).and("status", status));
        return query.page(Page.of(page, size)).list().stream()
                .map(PanacheNotificationRepository::toDomain)
                .toList();
    }

    @Override
    public long countByCustomer(String customerId, NotificationStatus status) {
        return status == null
                ? PaymentNotificationEntity.count(BY_CUSTOMER, Parameters.with("customerId", customerId))
                : PaymentNotificationEntity.count(BY_CUSTOMER_STATUS,
                        Parameters.with("customerId", customerId).and("status", status));
    }

    private static PaymentNotificationEntity toEntity(PaymentNotification n) {
        PaymentNotificationEntity e = new PaymentNotificationEntity();
        e.id = n.id();
        e.customerId = n.customerId();
        e.paymentReference = n.paymentReference();
        e.type = n.type();
        e.status = n.status();
        e.title = n.title();
        e.message = n.message();
        e.amount = n.amount();
        e.currency = n.currency();
        e.createdAt = n.createdAt();
        e.readAt = n.readAt();
        return e;
    }

    private static PaymentNotification toDomain(PaymentNotificationEntity e) {
        return new PaymentNotification(e.id, e.customerId, e.paymentReference, e.type, e.status,
                e.title, e.message, e.amount, e.currency, e.createdAt, e.readAt);
    }
}
