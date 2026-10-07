package com.banca.tarjetas.api;

import com.banca.tarjetas.dto.CardDetailDto;
import com.banca.tarjetas.dto.CardSummaryDto;
import com.banca.tarjetas.dto.PageDto;
import com.banca.tarjetas.organisms.CardQueryService;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

/** Plantilla/entrada HTTP delgada: delega en el organismo. */
@Path("/v1/cards")
@Produces(MediaType.APPLICATION_JSON)
public class CardResource {

    private final CardQueryService service;

    public CardResource(CardQueryService service) {
        this.service = service;
    }

    @GET
    public PageDto<CardSummaryDto> list(@QueryParam("status") String status,
                                        @QueryParam("page") @DefaultValue("0") int page,
                                        @QueryParam("size") @DefaultValue("10") int size) {
        return service.list(status, page, size);
    }

    @GET
    @Path("/{id}")
    public CardDetailDto get(@PathParam("id") String id) {
        return service.get(id);
    }
}
