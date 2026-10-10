package com.banca.pagos.notification.adapter;

import com.banca.pagos.notification.domain.NotificationStatus;
import com.banca.pagos.notification.domain.NotificationType;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payment_notification")
public class PaymentNotificationEntity extends PanacheEntityBase {

    @Id
    public UUID id;

    @Column(name = "customer_id", nullable = false)
    public String customerId;

    @Column(name = "payment_reference", nullable = false)
    public String paymentReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public NotificationStatus status;

    @Column(nullable = false)
    public String title;

    @Column(nullable = false)
    public String message;

    @Column(nullable = false, precision = 15, scale = 2)
    public BigDecimal amount;

    @Column(nullable = false, length = 3, columnDefinition = "char(3)")
    public String currency;

    @Column(name = "created_at", nullable = false)
    public Instant createdAt;

    @Column(name = "read_at")
    public Instant readAt;
}
