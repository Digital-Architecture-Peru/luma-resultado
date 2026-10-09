package com.banco.cuentas.api;

import com.banco.cuentas.domain.DomainException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.Map;

/** Errores uniformes application/problem+json; nunca expone excepciones internas. */
@Provider
public class DomainExceptionMapper implements ExceptionMapper<DomainException> {

    @Override
    public Response toResponse(DomainException e) {
        var kind = e.kind();
        Map<String, Object> body = Map.of(
                "type", "about:blank",
                "title", kind.title(),
                "status", kind.status(),
                "detail", e.getMessage());
        return Response.status(kind.status()).type("application/problem+json").entity(body).build();
    }
}
