package com.banca.tarjetas.api;

import com.banca.tarjetas.model.CardNotFoundException;
import com.banca.tarjetas.model.InvalidQueryException;
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
    public Response invalid(InvalidQueryException e) {
        return build(400, "Solicitud inválida", e.getMessage());
    }

    @ServerExceptionMapper
    public Response notFound(CardNotFoundException e) {
        return build(404, "No encontrado", e.getMessage());
    }

    @ServerExceptionMapper
    public Response unexpected(IllegalStateException e) {
        LOG.error("Error inesperado", e);
        return build(500, "Error interno", "Ocurrió un error inesperado");
    }

    static Response build(int status, String title, String detail) {
        Problem body = new Problem("about:blank", title, status, detail);
        return Response.status(status).type(PROBLEM_JSON).entity(body).build();
    }
}
