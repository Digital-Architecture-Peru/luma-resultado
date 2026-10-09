package com.banco.payments.api;

import com.banco.payments.domain.DuplicateIdempotencyKeyException;
import com.banco.payments.domain.InvalidPaymentException;
import com.banco.payments.domain.PaymentNotFoundException;
import com.banco.payments.infrastructure.PaymentPersistenceException;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

/** Traduce errores a application/problem+json sin exponer detalles internos. */
public class ApiExceptionMappers {

    private static final Logger LOG = Logger.getLogger(ApiExceptionMappers.class);
    private static final String PROBLEM_JSON = "application/problem+json";

    public record Problem(String type, String title, int status, String detail) {
    }

    @ServerExceptionMapper
    public Response invalid(InvalidPaymentException e) {
        return problem(400, "Solicitud invalida", e.getMessage());
    }

    @ServerExceptionMapper
    public Response duplicate(DuplicateIdempotencyKeyException e) {
        return problem(409, "Conflicto de idempotencia", e.getMessage());
    }

    @ServerExceptionMapper
    public Response notFound(PaymentNotFoundException e) {
        return problem(404, "No encontrado", e.getMessage());
    }

    @ServerExceptionMapper
    public Response persistence(PaymentPersistenceException e) {
        LOG.error("Error de persistencia", e);
        return problem(500, "Error interno", "No se pudo procesar la solicitud");
    }

    private static Response problem(int status, String title, String detail) {
        return Response.status(status).type(PROBLEM_JSON)
                .entity(new Problem("about:blank", title, status, detail)).build();
    }
}
