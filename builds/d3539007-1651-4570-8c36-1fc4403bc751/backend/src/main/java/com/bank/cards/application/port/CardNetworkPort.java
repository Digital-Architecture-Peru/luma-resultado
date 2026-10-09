package com.bank.cards.application.port;

import java.math.BigDecimal;
import java.util.UUID;

/** Puerto hacia la red/procesador de tarjetas (integracion sin definir). */
public interface CardNetworkPort {

    boolean authorize(UUID cardId, BigDecimal amount, String currency);
}
