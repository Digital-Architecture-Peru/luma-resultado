package com.banco.cards.api;

import com.banco.cards.application.CardNotFoundException;
import com.banco.cards.application.CardQueryService;
import com.banco.cards.application.CustomerContext;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/cards")
@Produces(MediaType.APPLICATION_JSON)
public class CardResource {

    private final CardQueryService service;
    private final CustomerContext customerContext;

    public CardResource(CardQueryService service, CustomerContext customerContext) {
        this.service = service;
        this.customerContext = customerContext;
    }

    @GET
    public List<CardDto> list() {
        return service.listFor(customerContext.currentCustomerId()).stream()
                .map(CardDto::from)
                .toList();
    }

    @GET
    @Path("/{cardId}")
    public CardDto get(@PathParam("cardId") String cardId) {
        return CardDto.from(service.getFor(customerContext.currentCustomerId(), parseId(cardId)));
    }

    /** Un id mal formado se trata como inexistente para no filtrar informacion. */
    private static UUID parseId(String raw) {
        try {
            return UUID.fromString(raw);
        } catch (IllegalArgumentException e) {
            throw new CardNotFoundException();
        }
    }
}
