package com.example.cards.port;

import java.math.BigDecimal;

/**
 * Integración con el core bancario (sin definir). Hoy solo existe un adaptador ficticio;
 * un adaptador real implementaría esta interfaz sin tocar el dominio.
 */
public interface CoreBankingPort {

    /** Notifica un pago ya validado. Lanza una excepción si el core lo rechaza. */
    void postPayment(String cardId, String accountId, BigDecimal amount);
}
