package com.banco.cards.api;

import com.banco.cards.domain.DomainException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/** Traduce errores del dominio a application/problem+json sin exponer trazas. */
@Provider
public class DomainExceptionMapper implements ExceptionMapper<DomainException> {

    public record Problem(String type, String title, int status, String detail) {
    }

    @Override
    public Response toResponse(DomainException e) {
        Problem body = new Problem("about:blank", e.title(), e.status(), e.getMessage());
        return Response.status(e.status()).type("application/problem+json").entity(body).build();
    }
}
