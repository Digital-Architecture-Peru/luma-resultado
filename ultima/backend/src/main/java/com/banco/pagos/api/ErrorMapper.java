package com.banco.pagos.api;

import com.banco.pagos.domain.PagoException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/** Traduce errores de dominio a application/problem+json sin exponer detalles internos. */
@Provider
public class ErrorMapper implements ExceptionMapper<PagoException> {

    public static final String PROBLEM_JSON = "application/problem+json";

    public record Problema(String type, String title, int status, String detail) {
    }

    @Override
    public Response toResponse(PagoException error) {
        Problema problema = construir(error);
        return Response.status(problema.status()).type(PROBLEM_JSON).entity(problema).build();
    }

    static Problema construir(PagoException error) {
        if (error instanceof PagoException.NoEncontrado) {
            return new Problema("about:blank", "Pago no encontrado", 404, error.getMessage());
        }
        if (error instanceof PagoException.ConflictoIdempotencia) {
            return new Problema("about:blank", "Conflicto de idempotencia", 409, error.getMessage());
        }
        return new Problema("about:blank", "Pago inválido", 422, error.getMessage());
    }
}
