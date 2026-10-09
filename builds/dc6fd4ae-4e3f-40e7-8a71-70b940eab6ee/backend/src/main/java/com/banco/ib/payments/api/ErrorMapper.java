package com.banco.ib.payments.api;

import com.banco.ib.payments.api.dto.ErrorResponse;
import com.banco.ib.payments.persistence.PaymentRepositoryException;
import com.banco.ib.payments.service.InvalidQueryException;
import com.banco.ib.payments.service.PaymentNotFoundException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

/** Traduce errores de dominio a respuestas {code,message} sin exponer detalles internos. */
public class ErrorMapper {

    private static final Logger LOG = Logger.getLogger(ErrorMapper.class);

    @ServerExceptionMapper
    public Response invalidQuery(InvalidQueryException e) {
        return build(Response.Status.BAD_REQUEST, "INVALID_REQUEST", e.getMessage());
    }

    @ServerExceptionMapper
    public Response notFound(PaymentNotFoundException e) {
        return build(Response.Status.NOT_FOUND, "PAYMENT_NOT_FOUND", e.getMessage());
    }

    @ServerExceptionMapper
    public Response persistence(PaymentRepositoryException e) {
        LOG.error("Error de persistencia", e);
        return build(Response.Status.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Error interno");
    }

    private static Response build(Response.Status status, String code, String message) {
        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorResponse(code, message))
                .build();
    }
}
