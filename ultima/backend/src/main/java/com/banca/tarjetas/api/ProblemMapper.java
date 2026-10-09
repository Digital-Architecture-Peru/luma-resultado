package com.banca.tarjetas.api;

import com.banca.tarjetas.api.dto.ProblemDetail;
import com.banca.tarjetas.application.TarjetaNoEncontradaException;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

/** Traduce excepciones a application/problem+json sin exponer detalles internos. */
public class ProblemMapper {

    public static final String PROBLEM_JSON = "application/problem+json";
    private static final Logger LOG = Logger.getLogger(ProblemMapper.class);

    @ServerExceptionMapper
    public Response clienteInvalido(ClienteInvalidoException e) {
        return respuesta(400, "Solicitud inválida", e.getMessage());
    }

    @ServerExceptionMapper
    public Response noEncontrada(TarjetaNoEncontradaException e) {
        return respuesta(404, "No encontrado", e.getMessage());
    }

    @ServerExceptionMapper
    public Response idInvalido(IllegalArgumentException e) {
        return respuesta(400, "Solicitud inválida", "Identificador con formato inválido");
    }

    @ServerExceptionMapper
    public Response inesperado(RuntimeException e) {
        LOG.error("Error no controlado", e);
        return respuesta(500, "Error interno", "No se pudo procesar la solicitud");
    }

    static Response respuesta(int status, String titulo, String detalle) {
        return Response.status(status)
                .type(PROBLEM_JSON)
                .entity(ProblemDetail.de(status, titulo, detalle))
                .build();
    }
}
