package com.example.banca.notification.adapters.out.persistence;

import com.example.banca.notification.domain.EventType;
import com.example.banca.notification.domain.NotificationRepository;
import com.example.banca.notification.domain.PageResult;
import com.example.banca.notification.domain.PaymentNotification;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

interface JpaNotificationRepository extends JpaRepository<NotificationEntity, UUID> {

    Optional<NotificationEntity> findByIdAndCustomerId(UUID id, String customerId);

    boolean existsByPaymentIdAndEventType(String paymentId, EventType eventType);

    Page<NotificationEntity> findByCustomerId(String customerId, org.springframework.data.domain.Pageable pageable);
}

@Repository
class NotificationRepositoryAdapter implements NotificationRepository {

    private final JpaNotificationRepository jpa;

    NotificationRepositoryAdapter(JpaNotificationRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public PaymentNotification save(PaymentNotification notification) {
        return jpa.save(NotificationEntity.from(notification)).toDomain();
    }

    @Override
    public Optional<PaymentNotification> findByIdAndCustomer(UUID id, String customerId) {
        return jpa.findByIdAndCustomerId(id, customerId).map(NotificationEntity::toDomain);
    }

    @Override
    public boolean exists(String paymentId, EventType eventType) {
        return jpa.existsByPaymentIdAndEventType(paymentId, eventType);
    }

    @Override
    public PageResult<PaymentNotification> findByCustomer(String customerId, int page, int size) {
        Page<NotificationEntity> result = jpa.findByCustomerId(customerId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return new PageResult<>(result.getContent().stream().map(NotificationEntity::toDomain).toList(),
                page, size, result.getTotalElements());
    }
}
