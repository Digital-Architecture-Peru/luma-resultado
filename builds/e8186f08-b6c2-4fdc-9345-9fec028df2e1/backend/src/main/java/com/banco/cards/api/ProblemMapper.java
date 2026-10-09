package com.banco.cards.api;

import com.banco.cards.domain.CardNotFoundException;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

/** Errores uniformes application/problem+json sin exponer detalles internos. */
public class ProblemMapper {

    private static final Logger LOG = Logger.getLogger(ProblemMapper.class);
    private static final String PROBLEM_JSON = "application/problem+json";

    public record Problem(String type, String title, int status, String detail) {
    }

    @ServerExceptionMapper
    public Response notFound(CardNotFoundException e) {
        return problem(404, "Tarjeta no encontrada", "La tarjeta solicitada no existe.");
    }

    @ServerExceptionMapper
    public Response badRequest(IllegalArgumentException e) {
        LOG.debugf("Solicitud inválida: %s", e.getMessage());
        return problem(400, "Solicitud inválida", "Cliente no identificado o parámetros inválidos.");
    }

    private static Response problem(int status, String title, String detail) {
        return Response.status(status)
                .type(PROBLEM_JSON)
                .entity(new Problem("about:blank", title, status, detail))
                .build();
    }
}
