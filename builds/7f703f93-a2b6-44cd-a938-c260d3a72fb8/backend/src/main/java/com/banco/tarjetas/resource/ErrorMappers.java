package com.banco.tarjetas.resource;

import com.banco.tarjetas.service.SolicitudInvalidaException;
import com.banco.tarjetas.service.TarjetaNoEncontradaException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;

/** Errores uniformes application/problem+json sin exponer detalles internos. */
public final class ErrorMappers {

    private ErrorMappers() {
    }

    static Response problema(int status, String titulo, String detalle) {
        return Response.status(status)
                .type("application/problem+json")
                .entity(Map.of("type", "about:blank", "title", titulo, "status", status, "detail", detalle))
                .build();
    }

    @Provider
    public static class SolicitudInvalida implements ExceptionMapper<SolicitudInvalidaException> {
        @Override
        public Response toResponse(SolicitudInvalidaException e) {
            return problema(Response.Status.BAD_REQUEST.getStatusCode(), "Solicitud inválida", e.getMessage());
        }
    }

    @Provider
    public static class NoEncontrada implements ExceptionMapper<TarjetaNoEncontradaException> {
        @Override
        public Response toResponse(TarjetaNoEncontradaException e) {
            return problema(Response.Status.NOT_FOUND.getStatusCode(), "Tarjeta no encontrada", e.getMessage());
        }
    }
}
