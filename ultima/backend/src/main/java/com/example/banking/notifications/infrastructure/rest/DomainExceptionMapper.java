package com.example.banking.notifications.infrastructure.rest;

import com.example.banking.notifications.domain.DomainException;
import com.example.banking.notifications.infrastructure.rest.Dtos.Problem;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/** Traduce errores del dominio a application/problem+json sin exponer detalles internos. */
@Provider
public class DomainExceptionMapper implements ExceptionMapper<DomainException> {

    static final String PROBLEM_JSON = "application/problem+json";

    @Override
    public Response toResponse(DomainException e) {
        int status = statusOf(e);
        Problem body = new Problem("about:blank", reason(status), status, e.getMessage());
        return Response.status(status).type(PROBLEM_JSON).entity(body).build();
    }

    static int statusOf(DomainException e) {
        if (e instanceof DomainException.NotFound) {
            return 404;
        }
        if (e instanceof DomainException.AccessDenied) {
            return 403;
        }
        if (e instanceof DomainException.MissingIdentity) {
            return 401;
        }
        return 400;
    }

    private static String reason(int status) {
        return switch (status) {
            case 401 -> "Unauthorized";
            case 403 -> "Forbidden";
            case 404 -> "Not Found";
            default -> "Bad Request";
        };
    }
}
