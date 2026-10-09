package com.banco.cuentas.api;

import com.banco.cuentas.domain.Account;
import com.banco.cuentas.domain.Movement;
import com.banco.cuentas.service.TransferService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1/accounts")
@Produces(MediaType.APPLICATION_JSON)
public class AccountResource {

    private final TransferService service;

    public AccountResource(TransferService service) {
        this.service = service;
    }

    @GET
    public List<Account> list() {
        return service.listAccounts();
    }

    @GET
    @Path("/{id}/movements")
    public List<Movement> movements(@PathParam("id") long id) {
        return service.listMovements(id);
    }
}
