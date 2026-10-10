package com.banco.notificaciones.service;

import com.banco.notificaciones.domain.NotificationType;
import java.math.BigDecimal;

/** Datos de entrada del caso de uso "registrar notificación de pago". */
public record NewNotification(
        String paymentId,
        NotificationType type,
        String title,
        String message,
        BigDecimal amount,
        String currency,
        String accountLast4) {
}
