package com.bank.cards.api;

import com.bank.cards.api.dto.CardDetailDto;
import com.bank.cards.api.dto.CardSummaryDto;
import com.bank.cards.service.CardQueryService;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cards")
public class CardController {

    // Hipotesis H1: cliente ficticio por header; en produccion vendria del token de sesion.
    static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final CardQueryService service;

    public CardController(CardQueryService service) {
        this.service = service;
    }

    @GetMapping
    public List<CardSummaryDto> list(@RequestHeader(CUSTOMER_HEADER) String customerId) {
        return service.listCards(customerId).stream().map(CardSummaryDto::from).toList();
    }

    @GetMapping("/{cardId}")
    public CardDetailDto detail(@RequestHeader(CUSTOMER_HEADER) String customerId,
                                @PathVariable UUID cardId) {
        return CardDetailDto.from(service.getCard(customerId, cardId));
    }
}
