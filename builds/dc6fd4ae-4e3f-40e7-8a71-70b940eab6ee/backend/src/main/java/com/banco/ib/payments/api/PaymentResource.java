package com.banco.ib.payments.api;

import com.banco.ib.payments.api.dto.PaymentDto;
import com.banco.ib.payments.domain.PageResult;
import com.banco.ib.payments.service.PaymentQueryService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

/**
 * Consulta de pagos (solo lectura).
 * El cliente se simula con X-Customer-Id (ficticio); reemplazar por identidad del token en producción.
 */
@Path("/api/v1/payments")
@Produces(MediaType.APPLICATION_JSON)
public class PaymentResource {

    private final PaymentQueryService service;

    public PaymentResource(PaymentQueryService service) {
        this.service = service;
    }

    @GET
    public PageResult<PaymentDto> list(
            @HeaderParam("X-Customer-Id") String customerId,
            @QueryParam("from") String from,
            @QueryParam("to") String to,
            @QueryParam("status") String status,
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size) {
        return service.search(customerId, from, to, status, page, size).map(PaymentDto::from);
    }

    @GET
    @Path("/{id}")
    public PaymentDto get(@HeaderParam("X-Customer-Id") String customerId, @PathParam("id") String id) {
        return PaymentDto.from(service.getById(customerId, id));
    }
}
