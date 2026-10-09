package com.banco.payments.api;

import com.banco.payments.application.CreatePaymentCommand;
import com.banco.payments.application.PaymentService;
import com.banco.payments.domain.Payment;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.util.UUID;

@Path("/api/v1/payments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentResource {

    private final PaymentService service;

    public PaymentResource(PaymentService service) {
        this.service = service;
    }

    @POST
    public Response create(@HeaderParam("Idempotency-Key") String idempotencyKey,
                           @Valid PaymentRequest request) {
        Payment payment = service.create(new CreatePaymentCommand(
                request.originAccount(), request.beneficiary(), request.amount(),
                request.currency(), request.concept(), idempotencyKey));
        return Response.created(URI.create("/api/v1/payments/" + payment.id()))
                .entity(PaymentResponse.from(payment)).build();
    }

    @GET
    @Path("/{id}")
    public PaymentResponse get(@PathParam("id") UUID id) {
        return PaymentResponse.from(service.get(id));
    }
}
