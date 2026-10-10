package com.banca.notificaciones.notification.resource;

import com.banca.notificaciones.notification.domain.DomainException;
import com.banca.notificaciones.notification.domain.Page;
import com.banca.notificaciones.notification.service.NotificationService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NotificationResource {

    private final NotificationService service;

    @Inject
    public NotificationResource(NotificationService service) {
        this.service = service;
    }

    @GET
    @Path("/accounts/{accountId}/notifications")
    public Page<NotificationDto> list(@PathParam("accountId") String accountId,
                                      @QueryParam("unread") @DefaultValue("false") boolean unread,
                                      @QueryParam("page") @DefaultValue("0") int page,
                                      @QueryParam("size") @DefaultValue("20") int size) {
        return service.list(accountId, unread, page, size).map(NotificationDto::from);
    }

    @PATCH
    @Path("/notifications/{id}/read")
    public NotificationDto markRead(@PathParam("id") String id) {
        return NotificationDto.from(service.markRead(id));
    }

    @GET
    @Path("/accounts/{accountId}/notification-preferences")
    public List<PreferenceDto> getPreferences(@PathParam("accountId") String accountId) {
        return service.getPreferences(accountId).stream().map(PreferenceDto::from).toList();
    }

    @PUT
    @Path("/accounts/{accountId}/notification-preferences")
    public List<PreferenceDto> updatePreferences(@PathParam("accountId") String accountId,
                                                 List<PreferenceDto> body) {
        if (body == null) {
            throw DomainException.badRequest("El cuerpo es obligatorio.");
        }
        List<PreferenceDto> safe = body.stream()
                .map(dto -> {
                    if (dto == null) {
                        throw DomainException.badRequest("Preferencia inválida.");
                    }
                    return dto;
                })
                .toList();
        return service.updatePreferences(accountId, safe.stream().map(PreferenceDto::toUpdate).toList())
                .stream().map(PreferenceDto::from).toList();
    }
}
