package com.banca.pagos.notification.service;

import com.banca.pagos.notification.domain.NotificationType;
import java.math.BigDecimal;

/** Evento de pago de entrada (simulado: el origen real está sin definir). */
public record PaymentEvent(
        String customerId,
        String paymentReference,
        NotificationType type,
        String accountNumber,
        BigDecimal amount,
        String currency) {
}
