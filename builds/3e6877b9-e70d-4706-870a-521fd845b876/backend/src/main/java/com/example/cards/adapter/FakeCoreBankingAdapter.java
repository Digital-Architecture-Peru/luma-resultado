package com.example.cards.adapter;

import com.example.cards.port.CoreBankingPort;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Adaptador ficticio: acepta todo. No registra montos ni identificadores completos. */
@Component
public class FakeCoreBankingAdapter implements CoreBankingPort {

    private static final Logger log = LoggerFactory.getLogger(FakeCoreBankingAdapter.class);

    @Override
    public void postPayment(String cardId, String accountId, BigDecimal amount) {
        log.debug("Pago aceptado por el core ficticio");
    }
}
