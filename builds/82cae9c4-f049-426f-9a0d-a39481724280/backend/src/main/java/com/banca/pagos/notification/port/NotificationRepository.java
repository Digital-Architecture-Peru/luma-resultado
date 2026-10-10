package com.banca.pagos.notification.port;

import com.banca.pagos.notification.domain.NotificationStatus;
import com.banca.pagos.notification.domain.NotificationType;
import com.banca.pagos.notification.domain.PaymentNotification;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia: el dominio no conoce Panache ni SQL. */
public interface NotificationRepository {

    Optional<PaymentNotification> findByIdAndCustomer(UUID id, String customerId);

    boolean existsByReferenceAndType(String paymentReference, NotificationType type);

    PaymentNotification save(PaymentNotification notification);

    /** {@code status} nulo significa sin filtro. */
    List<PaymentNotification> findByCustomer(String customerId, NotificationStatus status, int page, int size);

    long countByCustomer(String customerId, NotificationStatus status);
}
