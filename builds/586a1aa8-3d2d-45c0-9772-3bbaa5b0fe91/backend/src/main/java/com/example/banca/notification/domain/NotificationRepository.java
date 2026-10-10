package com.example.banca.notification.domain;

import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia de notificaciones. */
public interface NotificationRepository {

    PaymentNotification save(PaymentNotification notification);

    Optional<PaymentNotification> findByIdAndCustomer(UUID id, String customerId);

    boolean exists(String paymentId, EventType eventType);

    PageResult<PaymentNotification> findByCustomer(String customerId, int page, int size);
}
