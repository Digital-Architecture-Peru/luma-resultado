package com.banco.cards.integration;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.TransactionType;
import java.math.BigDecimal;

/** Puerto hacia el core de tarjetas. La integración real aún no está definida. */
public interface CardCoreGateway {

    /** Devuelve true si el core autoriza la operación. */
    boolean authorize(Card card, TransactionType type, BigDecimal amount, String currency);
}
