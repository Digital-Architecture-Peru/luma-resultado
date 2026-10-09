package com.banco.cuentas.api;

import com.banco.cuentas.api.ApiDtos.AccountDto;
import com.banco.cuentas.api.ApiDtos.MovementDto;
import com.banco.cuentas.domain.AccountService;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Path("/api/v1/accounts")
@Produces(MediaType.APPLICATION_JSON)
public class AccountResource {

    private final AccountService service;
    private final String ownerId;

    @Inject
    public AccountResource(AccountService service, @ConfigProperty(name = "app.owner-id") String ownerId) {
        this.service = service;
        this.ownerId = ownerId;
    }

    @GET
    public List<AccountDto> list() {
        return service.list(ownerId).stream().map(AccountDto::from).toList();
    }

    @GET
    @Path("/{id}/movements")
    public List<MovementDto> movements(@PathParam("id") long id,
                                       @QueryParam("page") @DefaultValue("0") int page,
                                       @QueryParam("size") @DefaultValue("20") int size) {
        return service.movements(ownerId, id, page, size).stream().map(MovementDto::from).toList();
    }
}
