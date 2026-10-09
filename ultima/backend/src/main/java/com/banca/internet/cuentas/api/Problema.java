package com.banca.internet.cuentas.api;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/** Cuerpo de error uniforme (problem+json). No expone detalles internos. */
public record Problema(String type, String title, int status, String detail) {

    public static final String PROBLEM_JSON = "application/problem+json";

    public static Response respuesta(Response.Status estado, String titulo, String detalle) {
        Problema cuerpo = new Problema("about:blank", titulo, estado.getStatusCode(), detalle);
        return Response.status(estado).type(MediaType.valueOf(PROBLEM_JSON)).entity(cuerpo).build();
    }
}
