package com.banco.cuentas.api;

import com.banco.cuentas.api.dto.TransferRequest;
import com.banco.cuentas.domain.TransferCommand;
import com.banco.cuentas.domain.TransferReceipt;
import com.banco.cuentas.domain.ValidationException;
import com.banco.cuentas.service.TransferService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/transfers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransferResource {

    private final TransferService service;

    public TransferResource(TransferService service) {
        this.service = service;
    }

    @POST
    public Response create(@HeaderParam("Idempotency-Key") String idempotencyKey, TransferRequest request) {
        if (request == null) {
            throw new ValidationException("El cuerpo de la solicitud es obligatorio.");
        }
        TransferCommand cmd = new TransferCommand(idempotencyKey, request.sourceAccountId(),
                request.targetAccountId(), request.amount(), request.currency(), request.description());
        TransferReceipt receipt = service.transfer(cmd);
        return Response.status(Response.Status.CREATED).entity(receipt).build();
    }
}
