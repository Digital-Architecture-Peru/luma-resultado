package com.example.tarjetas.notificaciones.api;

import com.example.tarjetas.notificaciones.api.dto.NotificacionDto;
import com.example.tarjetas.notificaciones.domain.Pagina;
import com.example.tarjetas.notificaciones.service.NotificacionService;
import jakarta.inject.Inject;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1")
@Produces(MediaType.APPLICATION_JSON)
public class NotificacionResource {

    private final NotificacionService servicio;

    @Inject
    public NotificacionResource(NotificacionService servicio) {
        this.servicio = servicio;
    }

    @GET
    @Path("/tarjetas/{tarjetaId}/notificaciones")
    public Pagina<NotificacionDto> listar(
            @PathParam("tarjetaId") @Pattern(regexp = "^[A-Za-z0-9-]{1,36}$") String tarjetaId,
            @QueryParam("leida") Boolean leida,
            @QueryParam("page") @DefaultValue("0") @Min(0) int page,
            @QueryParam("size") @DefaultValue("20") @Min(1) @Max(100) int size) {
        Pagina<com.example.tarjetas.notificaciones.domain.Notificacion> pagina =
                servicio.listar(tarjetaId, leida, page, size);
        List<NotificacionDto> items = pagina.items().stream().map(NotificacionDto::desde).toList();
        return new Pagina<>(items, pagina.page(), pagina.size(), pagina.total());
    }

    @PATCH
    @Path("/notificaciones/{id}/leida")
    public NotificacionDto marcarLeida(@PathParam("id") @Min(1) long id) {
        return NotificacionDto.desde(servicio.marcarLeida(id));
    }
}
