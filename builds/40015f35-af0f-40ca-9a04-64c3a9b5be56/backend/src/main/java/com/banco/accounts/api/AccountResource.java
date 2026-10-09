package com.banco.accounts.api;

import com.banco.accounts.api.dto.AccountDto;
import com.banco.accounts.api.dto.AccountPage;
import com.banco.accounts.service.AccountQueryService;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

/** Solo lectura. X-Customer-Id es un marcador provisional (el gateway resuelve la autenticación). */
@Path("/api/v1/accounts")
@Produces(MediaType.APPLICATION_JSON)
public class AccountResource {

    private final AccountQueryService service;

    public AccountResource(AccountQueryService service) {
        this.service = service;
    }

    @GET
    public AccountPage list(
            @HeaderParam("X-Customer-Id") String customerId,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        return service.list(customerId, page, size);
    }

    @GET
    @Path("/{id}")
    public AccountDto get(
            @HeaderParam("X-Customer-Id") String customerId,
            @PathParam("id") String id) {
        return service.get(customerId, id);
    }
}
