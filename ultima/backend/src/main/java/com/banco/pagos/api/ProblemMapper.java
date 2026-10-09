package com.banco.pagos.api;

import com.banco.pagos.service.ConsultaException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.LinkedHashMap;
import java.util.Map;

/** Traduce errores del dominio a application/problem+json sin exponer detalles internos. */
@Provider
public class ProblemMapper implements ExceptionMapper<ConsultaException> {

    public static final String PROBLEM_JSON = "application/problem+json";

    @Override
    public Response toResponse(ConsultaException e) {
        return Response.status(e.status())
                .type(PROBLEM_JSON)
                .entity(cuerpo(e))
                .build();
    }

    static Map<String, Object> cuerpo(ConsultaException e) {
        Map<String, Object> problema = new LinkedHashMap<>();
        problema.put("type", "about:blank");
        problema.put("title", e.title());
        problema.put("status", e.status());
        problema.put("detail", e.getMessage());
        return problema;
    }
}
