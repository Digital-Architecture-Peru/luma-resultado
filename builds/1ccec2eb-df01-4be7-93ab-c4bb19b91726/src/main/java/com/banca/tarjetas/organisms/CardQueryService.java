package com.banca.tarjetas.organisms;

import com.banca.tarjetas.atoms.CardIdValidator;
import com.banca.tarjetas.dto.CardDetailDto;
import com.banca.tarjetas.dto.CardSummaryDto;
import com.banca.tarjetas.dto.PageDto;
import com.banca.tarjetas.model.Card;
import com.banca.tarjetas.model.CardNotFoundException;
import com.banca.tarjetas.model.CardStatus;
import com.banca.tarjetas.model.InvalidQueryException;
import com.banca.tarjetas.molecules.CardMapper;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

/** Organismo: caso de uso de consulta de tarjetas (listado paginado y detalle). */
@ApplicationScoped
public class CardQueryService {

    static final int MAX_PAGE_SIZE = 50;

    private final CardCatalog catalog;
    private final CardMapper mapper;

    public CardQueryService(CardCatalog catalog, CardMapper mapper) {
        this.catalog = catalog;
        this.mapper = mapper;
    }

    public PageDto<CardSummaryDto> list(String status, int page, int size) {
        if (page < 0) {
            throw new InvalidQueryException("page debe ser >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new InvalidQueryException("size debe estar entre 1 y " + MAX_PAGE_SIZE);
        }
        var filter = CardStatus.parse(status);
        List<Card> filtered = catalog.findAll().stream()
                .filter(c -> filter.map(s -> s == c.status()).orElse(true))
                .toList();
        List<CardSummaryDto> items = filtered.stream()
                .skip((long) page * size)
                .limit(size)
                .map(mapper::toSummary)
                .toList();
        return new PageDto<>(items, page, size, filtered.size());
    }

    public CardDetailDto get(String id) {
        if (!CardIdValidator.isValid(id)) {
            throw new InvalidQueryException("Identificador de tarjeta inválido");
        }
        return catalog.findById(id)
                .map(mapper::toDetail)
                .orElseThrow(() -> new CardNotFoundException(id));
    }
}
