package com.bank.cards.notifications.api;

import com.bank.cards.notifications.api.ApiDtos.NotificationDto;
import com.bank.cards.notifications.api.ApiDtos.PageDto;
import com.bank.cards.notifications.api.ApiDtos.PreferenceDto;
import com.bank.cards.notifications.domain.Preference;
import com.bank.cards.notifications.service.NotificationService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import java.util.UUID;

/**
 * API REST v1 del centro de notificaciones de tarjetas. Capa delgada: delega en {@link NotificationService}.
 * La identidad del cliente llega en X-Customer-Id (la autenticación real pertenece a Banca por Internet).
 */
@Path("/api/v1")
@Produces(MediaType.APPLICATION_JSON)
public class NotificationResource {

    private static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final NotificationService service;

    @Inject
    public NotificationResource(NotificationService service) {
        this.service = service;
    }

    @GET
    @Path("/cards/{cardId}/notifications")
    public PageDto<NotificationDto> list(
            @HeaderParam(CUSTOMER_HEADER) String customerId,
            @PathParam("cardId") UUID cardId,
            @QueryParam("unread") @DefaultValue("false") boolean unread,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        return PageDto.from(service.list(customerId, cardId, unread, page, size));
    }

    @PATCH
    @Path("/notifications/{id}/read")
    public NotificationDto markRead(
            @HeaderParam(CUSTOMER_HEADER) String customerId, @PathParam("id") UUID id) {
        return NotificationDto.from(service.markRead(customerId, id));
    }

    @GET
    @Path("/cards/{cardId}/notification-preferences")
    public List<PreferenceDto> getPreferences(
            @HeaderParam(CUSTOMER_HEADER) String customerId, @PathParam("cardId") UUID cardId) {
        return service.getPreferences(customerId, cardId).stream().map(PreferenceDto::from).toList();
    }

    @PUT
    @Path("/cards/{cardId}/notification-preferences")
    @Consumes(MediaType.APPLICATION_JSON)
    public List<PreferenceDto> updatePreferences(
            @HeaderParam(CUSTOMER_HEADER) String customerId,
            @PathParam("cardId") UUID cardId,
            List<PreferenceDto> body) {
        List<Preference> requested = body == null ? null : body.stream().map(NotificationResource::toDomain).toList();
        return service.updatePreferences(customerId, cardId, requested).stream()
                .map(PreferenceDto::from)
                .toList();
    }

    private static Preference toDomain(PreferenceDto dto) {
        return dto == null ? null : dto.toDomain();
    }
}
