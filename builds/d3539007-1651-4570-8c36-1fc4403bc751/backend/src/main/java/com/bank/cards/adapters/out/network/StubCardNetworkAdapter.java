package com.bank.cards.adapters.out.network;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.bank.cards.application.port.CardNetworkPort;

/** Stub (H4): aprueba montos positivos hasta un maximo por operacion. Sin llamadas externas. */
@Component
public class StubCardNetworkAdapter implements CardNetworkPort {

    static final BigDecimal MAX_PER_OPERATION = new BigDecimal("100000.00");

    @Override
    public boolean authorize(UUID cardId, BigDecimal amount, String currency) {
        return amount.signum() > 0 && amount.compareTo(MAX_PER_OPERATION) <= 0;
    }
}
