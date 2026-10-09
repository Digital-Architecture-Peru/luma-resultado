package com.bank.cards.notifications.api;

import com.bank.cards.notifications.api.ApiDtos.ProblemDto;
import com.bank.cards.notifications.service.DomainException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

/** Manejo centralizado de errores con cuerpo uniforme (campos de RFC 7807). No expone excepciones internas. */
public class ErrorMapper {

    private static final Logger LOG = Logger.getLogger(ErrorMapper.class);

    @ServerExceptionMapper
    public Response onDomainError(DomainException e) {
        return problem(e.status(), e.title(), e.getMessage());
    }

    @ServerExceptionMapper
    public Response onUnexpected(Exception e) {
        if (e instanceof WebApplicationException web) {
            return web.getResponse();
        }
        // Solo se registra la excepción; nunca el cuerpo de la petición.
        LOG.error("Error no controlado", e);
        return problem(500, "Error interno", "Ocurrió un error inesperado.");
    }

    private static Response problem(int status, String title, String detail) {
        ProblemDto body = new ProblemDto("about:blank", title, status, detail);
        return Response.status(status).type(MediaType.APPLICATION_JSON).entity(body).build();
    }
}
