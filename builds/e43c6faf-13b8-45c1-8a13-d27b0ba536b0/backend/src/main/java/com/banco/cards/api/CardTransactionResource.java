package com.banco.cards.api;

import com.banco.cards.domain.CardTransaction;
import com.banco.cards.service.CardTransactionService;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/cards/{cardId}/transactions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CardTransactionResource {

    private final CardTransactionService service;

    public CardTransactionResource(CardTransactionService service) {
        this.service = service;
    }

    @GET
    public List<TransactionResponse> list(@PathParam("cardId") UUID cardId,
                                          @QueryParam("limit") @DefaultValue("20") int limit) {
        return service.list(cardId, limit).stream().map(TransactionResponse::from).toList();
    }

    @POST
    public Response create(@PathParam("cardId") UUID cardId,
                           @HeaderParam("Idempotency-Key") String idempotencyKey,
                           @Valid CreateTransactionRequest request) {
        CardTransaction tx = service.register(cardId, idempotencyKey, request.type(), request.amount(),
                request.currency(), request.description());
        URI location = URI.create("/api/v1/cards/" + cardId + "/transactions/" + tx.id());
        return Response.created(location).entity(TransactionResponse.from(tx)).build();
    }
}
