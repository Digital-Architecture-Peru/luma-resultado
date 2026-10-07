package com.banca.internet.tarjetas.web;

import com.banca.internet.tarjetas.molecules.CardResponse;
import com.banca.internet.tarjetas.molecules.PageResponse;
import com.banca.internet.tarjetas.organisms.CardQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/cards")
public class CardController {

    private final CardQueryService service;

    public CardController(CardQueryService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<CardResponse> list(
            @RequestParam String customerId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.list(customerId, status, page, size);
    }

    @GetMapping("/{id}")
    public CardResponse get(@PathVariable long id, @RequestParam String customerId) {
        return service.get(customerId, id);
    }
}
