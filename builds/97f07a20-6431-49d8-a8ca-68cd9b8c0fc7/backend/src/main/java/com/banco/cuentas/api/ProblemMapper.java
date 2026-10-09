package com.banco.cuentas.api;

import com.banco.cuentas.domain.DomainException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.LinkedHashMap;
import java.util.Map;

/** Traduce errores de dominio a application/problem+json (RFC 7807). */
@Provider
public class ProblemMapper implements ExceptionMapper<DomainException> {

    public static final String PROBLEM_JSON = "application/problem+json";

    @Override
    public Response toResponse(DomainException e) {
        return Response.status(e.status())
                .type(PROBLEM_JSON)
                .entity(problem(e.status(), e.code(), e.getMessage()))
                .build();
    }

    static Map<String, Object> problem(int status, String code, String detail) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "urn:problem:" + code);
        body.put("title", code);
        body.put("status", status);
        body.put("detail", detail);
        return body;
    }
}
