package com.example.banca.notification.domain;

import java.math.BigDecimal;

/** Evento de pago recibido (simulado; no hay broker definido). */
public record PaymentEvent(String customerId, String paymentId, EventType eventType,
                           BigDecimal amount, String currency, String accountNumber) {
}
