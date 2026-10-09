package com.banco.cards.integration;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.TransactionType;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;

/** Adaptador simulado: aprueba salvo montos sobre el tope ficticio. Sin llamadas externas. */
@ApplicationScoped
public class FakeCardCoreGateway implements CardCoreGateway {

    static final BigDecimal SINGLE_OPERATION_CAP = new BigDecimal("10000.00");

    @Override
    public boolean authorize(Card card, TransactionType type, BigDecimal amount, String currency) {
        return amount.compareTo(SINGLE_OPERATION_CAP) <= 0;
    }
}
