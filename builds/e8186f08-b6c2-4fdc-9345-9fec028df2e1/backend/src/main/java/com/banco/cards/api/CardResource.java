package com.banco.cards.api;

import com.banco.cards.service.CardQueryService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import java.util.UUID;

/**
 * Consulta de tarjetas (solo lectura).
 * H2: el cliente llega por X-Customer-Id solo para dev; debe reemplazarse por el sujeto de un token OIDC.
 */
@Path("/api/v1/cards")
@Produces(MediaType.APPLICATION_JSON)
public class CardResource {

    static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final CardQueryService service;

    public CardResource(CardQueryService service) {
        this.service = service;
    }

    @GET
    public List<CardSummaryDto> list(@HeaderParam(CUSTOMER_HEADER) String customerId) {
        return service.listCards(customerId).stream().map(CardSummaryDto::from).toList();
    }

    @GET
    @Path("/{cardId}")
    public CardDetailDto detail(@HeaderParam(CUSTOMER_HEADER) String customerId,
                                @PathParam("cardId") UUID cardId) {
        return CardDetailDto.from(service.getCard(customerId, cardId));
    }
}
