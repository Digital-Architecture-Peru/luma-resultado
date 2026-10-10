package com.example.banking.notifications.infrastructure.rest;

import com.example.banking.notifications.application.GetPreferences;
import com.example.banking.notifications.application.ListNotifications;
import com.example.banking.notifications.application.MarkAsRead;
import com.example.banking.notifications.application.UpdatePreferences;
import com.example.banking.notifications.domain.DomainException;
import com.example.banking.notifications.domain.NotificationStatus;
import com.example.banking.notifications.infrastructure.rest.Dtos.NotificationResponse;
import com.example.banking.notifications.infrastructure.rest.Dtos.PreferenceDto;
import com.example.banking.notifications.infrastructure.rest.Dtos.PreferencesRequest;
import jakarta.validation.Valid;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Autenticación simulada: el gateway de Banca por Internet inyecta X-Customer-Id (hipótesis H2).
 */
@Path("/api/v1")
@Produces(MediaType.APPLICATION_JSON)
public class NotificationsResource {

    private static final Logger LOG = Logger.getLogger(NotificationsResource.class);
    static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final ListNotifications listNotifications;
    private final MarkAsRead markAsRead;
    private final GetPreferences getPreferences;
    private final UpdatePreferences updatePreferences;

    public NotificationsResource(ListNotifications listNotifications, MarkAsRead markAsRead,
                                 GetPreferences getPreferences, UpdatePreferences updatePreferences) {
        this.listNotifications = listNotifications;
        this.markAsRead = markAsRead;
        this.getPreferences = getPreferences;
        this.updatePreferences = updatePreferences;
    }

    @GET
    @Path("/accounts/{accountId}/notifications")
    public List<NotificationResponse> list(@HeaderParam(CUSTOMER_HEADER) String customerId,
                                           @PathParam("accountId") String accountId,
                                           @QueryParam("status") String status,
                                           @QueryParam("page") @DefaultValue("0") int page,
                                           @QueryParam("size") @DefaultValue("20") int size) {
        LOG.debugf("Listando notificaciones page=%d size=%d", page, size);
        return listNotifications.execute(customerId, accountId, parseStatus(status), page, size)
                .stream().map(NotificationResponse::from).toList();
    }

    @PATCH
    @Path("/notifications/{id}/read")
    public NotificationResponse markRead(@HeaderParam(CUSTOMER_HEADER) String customerId,
                                         @PathParam("id") String id) {
        return NotificationResponse.from(markAsRead.execute(customerId, parseId(id)));
    }

    @GET
    @Path("/accounts/{accountId}/notification-preferences")
    public List<PreferenceDto> preferences(@HeaderParam(CUSTOMER_HEADER) String customerId,
                                           @PathParam("accountId") String accountId) {
        return getPreferences.execute(customerId, accountId).stream().map(PreferenceDto::from).toList();
    }

    @PUT
    @Path("/accounts/{accountId}/notification-preferences")
    @Consumes(MediaType.APPLICATION_JSON)
    public List<PreferenceDto> savePreferences(@HeaderParam(CUSTOMER_HEADER) String customerId,
                                               @PathParam("accountId") String accountId,
                                               @Valid PreferencesRequest request) {
        var domain = request.preferences().stream().map(p -> p.toDomain(accountId)).toList();
        return updatePreferences.execute(customerId, accountId, domain).stream().map(PreferenceDto::from).toList();
    }

    private static Optional<NotificationStatus> parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return Optional.empty();
        }
        try {
            return Optional.of(NotificationStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new DomainException.InvalidRequest("status debe ser UNREAD o READ");
        }
    }

    private static UUID parseId(String id) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new DomainException.InvalidRequest("id de notificación inválido");
        }
    }
}
