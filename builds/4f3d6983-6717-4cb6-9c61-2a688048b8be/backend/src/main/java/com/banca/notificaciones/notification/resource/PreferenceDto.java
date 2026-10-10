package com.banca.notificaciones.notification.resource;

import com.banca.notificaciones.notification.domain.NotificationPreference;
import com.banca.notificaciones.notification.domain.NotificationType;
import com.banca.notificaciones.notification.domain.PreferenceUpdate;
import java.math.BigDecimal;

public record PreferenceDto(NotificationType type, boolean enabled, BigDecimal threshold) {

    public static PreferenceDto from(NotificationPreference p) {
        return new PreferenceDto(p.getType(), p.isEnabled(), p.getThreshold());
    }

    public PreferenceUpdate toUpdate() {
        return new PreferenceUpdate(type, enabled, threshold);
    }
}
