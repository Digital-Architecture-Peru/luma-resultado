package com.banca.notificaciones.notification.resource;

import com.banca.notificaciones.notification.domain.DomainException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/** Traduce errores de negocio a {code, message}; no expone trazas internas. */
@Provider
public class DomainExceptionMapper implements ExceptionMapper<DomainException> {

    public record ErrorBody(String code, String message) {
    }

    @Override
    public Response toResponse(DomainException exception) {
        return Response.status(exception.getStatus())
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorBody(exception.getCode(), exception.getMessage()))
                .build();
    }
}
