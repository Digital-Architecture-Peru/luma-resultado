package com.bank.cards.notifications.port;

import java.util.UUID;

/**
 * Verifica que una tarjeta pertenece al cliente autenticado (evita IDOR).
 * La integración real con el core de tarjetas está sin definir.
 */
@FunctionalInterface
public interface CardOwnershipPort {

    boolean isOwner(String customerId, UUID cardId);
}
