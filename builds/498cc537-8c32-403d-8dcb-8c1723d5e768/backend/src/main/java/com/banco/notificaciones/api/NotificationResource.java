package com.banco.notificaciones.api;

import com.banco.notificaciones.service.NotificationService;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

/** Capa de entrada: traduce HTTP al servicio. X-Customer-Id es un sustituto temporal de la autenticación (H2). */
@Path("/api/v1/notifications")
@Produces(MediaType.APPLICATION_JSON)
public class NotificationResource {

    private static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final NotificationService service;

    public NotificationResource(NotificationService service) {
        this.service = service;
    }

    @GET
    public List<NotificationDto> list(
            @HeaderParam(CUSTOMER_HEADER) String customerId,
            @QueryParam("status") @DefaultValue("unread") String status,
            @QueryParam("limit") @DefaultValue("20") int limit) {
        return service.list(customerId, status, limit).stream().map(NotificationDto::from).toList();
    }

    @GET
    @Path("/unread-count")
    public UnreadCountDto unreadCount(@HeaderParam(CUSTOMER_HEADER) String customerId) {
        return new UnreadCountDto(service.unreadCount(customerId));
    }

    @PATCH
    @Path("/{id}/read")
    public Response markRead(@HeaderParam(CUSTOMER_HEADER) String customerId, @PathParam("id") UUID id) {
        service.markRead(customerId, id);
        return Response.noContent().build();
    }

    /** Endpoint interno que simula un evento de pago (H3). */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@HeaderParam(CUSTOMER_HEADER) String customerId, @Valid CreateNotificationRequest request) {
        NotificationDto created = NotificationDto.from(service.create(customerId, request.toDomain()));
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
