package com.banca.internet.tarjetas.organisms;

import com.banca.internet.tarjetas.atoms.CardNotFoundException;
import com.banca.internet.tarjetas.atoms.CardStatus;
import com.banca.internet.tarjetas.atoms.InvalidRequestException;
import com.banca.internet.tarjetas.molecules.CardRepository;
import com.banca.internet.tarjetas.molecules.CardResponse;
import com.banca.internet.tarjetas.molecules.PageResponse;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

/** Organism: caso de uso de consulta de tarjetas de un cliente. */
@Service
public class CardQueryService {

    static final int MAX_PAGE_SIZE = 50;

    private final CardRepository repository;

    public CardQueryService(CardRepository repository) {
        this.repository = repository;
    }

    public PageResponse<CardResponse> list(String customerId, String statusFilter, int page, int size) {
        requireCustomer(customerId);
        if (page < 0) {
            throw new InvalidRequestException("page debe ser >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new InvalidRequestException("size debe estar entre 1 y " + MAX_PAGE_SIZE);
        }
        Optional<CardStatus> status = CardStatus.parse(statusFilter);
        long total = repository.countByCustomer(customerId, status);
        List<CardResponse> items = repository
                .findByCustomer(customerId, status, size, page * size)
                .stream()
                .map(CardResponse::from)
                .toList();
        return new PageResponse<>(items, page, size, total);
    }

    public CardResponse get(String customerId, long cardId) {
        requireCustomer(customerId);
        return repository.findByIdAndCustomer(cardId, customerId)
                .map(CardResponse::from)
                .orElseThrow(() -> new CardNotFoundException(cardId));
    }

    private static void requireCustomer(String customerId) {
        if (customerId == null || !customerId.matches("[A-Za-z0-9-]{1,36}")) {
            throw new InvalidRequestException("customerId inválido");
        }
    }
}
