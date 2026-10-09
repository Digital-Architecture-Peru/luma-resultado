package com.bank.cards.notifications.adapter;

import com.bank.cards.notifications.port.CardOwnershipPort;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Stub de propiedad de tarjetas con datos ficticios (los mismos del seed).
 * Se reemplaza por la integración real con el core de tarjetas (sin definir).
 */
@ApplicationScoped
public class StubCardOwnership implements CardOwnershipPort {

    private static final UUID CARD_A = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final UUID CARD_B = UUID.fromString("22222222-2222-4222-8222-222222222222");

    private static final Map<String, Set<UUID>> CARDS_BY_CUSTOMER =
            Map.of("cust-demo-001", Set.of(CARD_A, CARD_B));

    @Override
    public boolean isOwner(String customerId, UUID cardId) {
        return CARDS_BY_CUSTOMER.getOrDefault(customerId, Set.of()).contains(cardId);
    }
}
