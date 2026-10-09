package com.demo.tarjetas.transaccion.api;

import com.demo.tarjetas.transaccion.domain.DominioException;
import com.demo.tarjetas.transaccion.domain.TarjetaNoEncontradaException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.Map;

/** Traduce errores de dominio a application/problem+json. */
@Provider
public class DominioExceptionMapper implements ExceptionMapper<DominioException> {

    private static final int NO_ENCONTRADO = 404;
    private static final int NO_PROCESABLE = 422;

    @Override
    public Response toResponse(DominioException e) {
        int status = e instanceof TarjetaNoEncontradaException ? NO_ENCONTRADO : NO_PROCESABLE;
        String titulo = status == NO_ENCONTRADO ? "Recurso no encontrado" : "Regla de negocio incumplida";
        Map<String, Object> problema = Map.of(
                "type", "about:blank",
                "title", titulo,
                "status", status,
                "detail", e.getMessage());
        return Response.status(status).type("application/problem+json").entity(problema).build();
    }
}
