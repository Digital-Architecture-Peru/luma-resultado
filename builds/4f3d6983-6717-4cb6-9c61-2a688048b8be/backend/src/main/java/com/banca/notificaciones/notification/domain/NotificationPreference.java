package com.banca.notificaciones.notification.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "notification_preference")
@IdClass(PreferenceId.class)
public class NotificationPreference {

    @Id
    @Column(name = "account_id")
    private String accountId;

    @Id
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(nullable = false)
    private boolean enabled;

    private BigDecimal threshold;

    protected NotificationPreference() {
        // requerido por JPA
    }

    public static NotificationPreference defaults(String accountId, NotificationType type) {
        NotificationPreference p = new NotificationPreference();
        p.accountId = accountId;
        p.type = type;
        p.enabled = true;
        return p;
    }

    public void update(boolean enabled, BigDecimal threshold) {
        this.enabled = enabled;
        this.threshold = threshold;
    }

    public String getAccountId() {
        return accountId;
    }

    public NotificationType getType() {
        return type;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public BigDecimal getThreshold() {
        return threshold;
    }
}
