package com.banco.cards.api;

import com.banco.cards.service.CardQueryService;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cards")
public class CardController {

    private final CardQueryService service;

    public CardController(CardQueryService service) {
        this.service = service;
    }

    @GetMapping
    public List<CardSummaryDto> list() {
        return service.listMyCards().stream().map(CardSummaryDto::from).toList();
    }

    @GetMapping("/{cardId}")
    public CardDetailDto detail(@PathVariable UUID cardId) {
        return CardDetailDto.from(service.getMyCard(cardId));
    }
}
