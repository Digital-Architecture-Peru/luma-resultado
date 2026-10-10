package com.banca.notificaciones.notification.domain;

import java.math.BigDecimal;

public record PreferenceUpdate(NotificationType type, boolean enabled, BigDecimal threshold) {
}
