package com.banco.cards.api;

import com.banco.cards.application.CardNotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.LinkedHashMap;
import java.util.Map;

@Provider
public class ProblemMapper implements ExceptionMapper<CardNotFoundException> {

    public static final String PROBLEM_JSON = "application/problem+json";

    @Override
    public Response toResponse(CardNotFoundException exception) {
        return Response.status(Response.Status.NOT_FOUND)
                .type(PROBLEM_JSON)
                .entity(problem(404, "Tarjeta no encontrada", exception.getMessage()))
                .build();
    }

    static Map<String, Object> problem(int status, String title, String detail) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "about:blank");
        body.put("title", title);
        body.put("status", status);
        body.put("detail", detail);
        return body;
    }
}
