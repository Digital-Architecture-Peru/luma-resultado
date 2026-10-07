package com.banca.internet.tarjetas;

import com.banca.internet.tarjetas.atoms.Card;
import com.banca.internet.tarjetas.atoms.CardStatus;
import com.banca.internet.tarjetas.atoms.MaskedPan;
import com.banca.internet.tarjetas.molecules.CardRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/** Doble en memoria del puerto CardRepository para pruebas unitarias. */
public class FakeCardRepository implements CardRepository {

    private final List<Card> cards = List.of(
            card(1, "CLI-1", "1111", CardStatus.ACTIVE),
            card(2, "CLI-1", "2222", CardStatus.BLOCKED),
            card(3, "CLI-1", "3333", CardStatus.ACTIVE),
            card(4, "CLI-2", "4444", CardStatus.ACTIVE));

    private static Card card(long id, String customer, String last4, CardStatus status) {
        return new Card(id, customer, new MaskedPan(last4), "VISA", "CREDIT", status, "USD",
                new BigDecimal("1000.00"), new BigDecimal("500.00"), LocalDate.of(2028, 1, 31));
    }

    private List<Card> filtered(String customerId, Optional<CardStatus> status) {
        return cards.stream()
                .filter(c -> c.customerId().equals(customerId))
                .filter(c -> status.map(s -> s == c.status()).orElse(true))
                .toList();
    }

    @Override
    public List<Card> findByCustomer(String customerId, Optional<CardStatus> status, int limit, int offset) {
        return filtered(customerId, status).stream().skip(offset).limit(limit).toList();
    }

    @Override
    public long countByCustomer(String customerId, Optional<CardStatus> status) {
        return filtered(customerId, status).size();
    }

    @Override
    public Optional<Card> findByIdAndCustomer(long id, String customerId) {
        return cards.stream().filter(c -> c.id() == id && c.customerId().equals(customerId)).findFirst();
    }
}
