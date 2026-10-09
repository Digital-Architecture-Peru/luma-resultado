package com.banco.cuentas.api;

import com.banco.cuentas.api.ApiDtos.TransferRequest;
import com.banco.cuentas.api.ApiDtos.TransferResponse;
import com.banco.cuentas.domain.DomainException;
import com.banco.cuentas.domain.TransferCommand;
import com.banco.cuentas.domain.TransferService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Path("/api/v1/transfers")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TransferResource {

    private final TransferService service;
    private final String ownerId;

    @Inject
    public TransferResource(TransferService service, @ConfigProperty(name = "app.owner-id") String ownerId) {
        this.service = service;
        this.ownerId = ownerId;
    }

    @POST
    public Response create(@HeaderParam("Idempotency-Key") String idempotencyKey, TransferRequest request) {
        var transfer = service.execute(toCommand(idempotencyKey, request));
        return Response.status(Response.Status.CREATED).entity(TransferResponse.from(transfer)).build();
    }

    private TransferCommand toCommand(String key, TransferRequest r) {
        if (r == null || r.sourceAccountId() == null || r.targetAccountId() == null || r.amount() == null) {
            throw DomainException.validation("sourceAccountId, targetAccountId y amount son obligatorios");
        }
        return new TransferCommand(ownerId, key, r.sourceAccountId(), r.targetAccountId(), parseAmount(r.amount()),
                r.currency(), r.description());
    }

    private BigDecimal parseAmount(String raw) {
        try {
            return new BigDecimal(raw.trim());
        } catch (NumberFormatException e) {
            throw DomainException.validation("El monto no es un numero decimal valido");
        }
    }
}
