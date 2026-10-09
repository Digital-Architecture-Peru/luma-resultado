package com.example.tarjetas.notificaciones.api;

import com.example.tarjetas.notificaciones.domain.NotificacionNoEncontradaException;
import com.example.tarjetas.notificaciones.port.RepositorioException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

/** Errores uniformes en application/problem+json, sin exponer detalles internos. */
public class ErrorHandler {

    private static final Logger LOG = Logger.getLogger(ErrorHandler.class);

    @ServerExceptionMapper
    public Response noEncontrada(NotificacionNoEncontradaException e) {
        return problema(404, "Notificación no encontrada", e.getMessage());
    }

    @ServerExceptionMapper
    public Response argumentoInvalido(IllegalArgumentException e) {
        return problema(400, "Solicitud inválida", e.getMessage());
    }

    @ServerExceptionMapper
    public Response falloDePersistencia(RepositorioException e) {
        LOG.error("Fallo de persistencia", e);
        return problema(503, "Servicio no disponible", "No se pudo acceder a los datos");
    }

    private static Response problema(int status, String titulo, String detalle) {
        Map<String, Object> cuerpo = Map.of(
                "type", "about:blank",
                "title", titulo,
                "status", status,
                "detail", detalle == null ? "" : detalle);
        return Response.status(status)
                .type("application/problem+json")
                .entity(cuerpo)
                .build();
    }
}
