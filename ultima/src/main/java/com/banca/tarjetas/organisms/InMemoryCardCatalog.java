package com.banca.tarjetas.organisms;

import com.banca.tarjetas.model.Card;
import com.banca.tarjetas.model.CardStatus;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

/** Adaptador con datos ficticios (no hay persistencia). */
@ApplicationScoped
public class InMemoryCardCatalog implements CardCatalog {

    private static final List<Card> CARDS = List.of(
            new Card("CARD-001", "4111111111111111", "ANA EJEMPLO", "VISA", CardStatus.ACTIVE,
                    YearMonth.of(2029, 5), new BigDecimal("5000.00"), new BigDecimal("3200.50"), "USD"),
            new Card("CARD-002", "5500000000000004", "ANA EJEMPLO", "MASTERCARD", CardStatus.BLOCKED,
                    YearMonth.of(2028, 11), new BigDecimal("2000.00"), new BigDecimal("0.00"), "USD"),
            new Card("CARD-003", "340000000000009", "ANA EJEMPLO", "AMEX", CardStatus.EXPIRED,
                    YearMonth.of(2024, 1), new BigDecimal("8000.00"), new BigDecimal("8000.00"), "USD"));

    @Override
    public List<Card> findAll() {
        return CARDS;
    }

    @Override
    public Optional<Card> findById(String id) {
        return CARDS.stream().filter(c -> c.id().equals(id)).findFirst();
    }
}
