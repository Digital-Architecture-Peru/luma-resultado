package com.banco.notificaciones.api;

import com.banco.notificaciones.service.DuplicateNotificationException;
import com.banco.notificaciones.service.NotificationNotFoundException;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

/** Errores uniformes application/problem+json sin exponer detalles internos. */
public class ProblemExceptionMappers {

    private static final String PROBLEM_JSON = "application/problem+json";

    public record Problem(String type, String title, int status, String detail) {
    }

    @ServerExceptionMapper
    public Response notFound(NotificationNotFoundException e) {
        return problem(Response.Status.NOT_FOUND, "Not Found", e.getMessage());
    }

    @ServerExceptionMapper
    public Response duplicate(DuplicateNotificationException e) {
        return problem(Response.Status.CONFLICT, "Conflict", e.getMessage());
    }

    @ServerExceptionMapper
    public Response badRequest(IllegalArgumentException e) {
        return problem(Response.Status.BAD_REQUEST, "Bad Request", e.getMessage());
    }

    private static Response problem(Response.Status status, String title, String detail) {
        Problem body = new Problem("about:blank", title, status.getStatusCode(), detail);
        return Response.status(status).type(PROBLEM_JSON).entity(body).build();
    }
}
