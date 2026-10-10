package com.banca.pagos.notification.api;

import com.banca.pagos.notification.api.dto.PaymentNotificationDtos.CreateRequest;
import com.banca.pagos.notification.api.dto.PaymentNotificationDtos.NotificationResponse;
import com.banca.pagos.notification.api.dto.PaymentNotificationDtos.PageResponse;
import com.banca.pagos.notification.domain.NotificationStatus;
import com.banca.pagos.notification.domain.PaymentNotification;
import com.banca.pagos.notification.service.NotificationException;
import com.banca.pagos.notification.service.PageResult;
import com.banca.pagos.notification.service.PaymentEvent;
import com.banca.pagos.notification.service.PaymentNotificationService;
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
import java.util.Locale;
import java.util.UUID;

@Path("/api/v1/payment-notifications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentNotificationResource {

    private static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final PaymentNotificationService service;

    public PaymentNotificationResource(PaymentNotificationService service) {
        this.service = service;
    }

    @GET
    public PageResponse list(@HeaderParam(CUSTOMER_HEADER) String customerId,
                             @QueryParam("status") String status,
                             @QueryParam("page") @DefaultValue("0") int page,
                             @QueryParam("size") @DefaultValue("20") int size) {
        PageResult<PaymentNotification> result = service.list(customerId, parseStatus(status), page, size);
        return new PageResponse(result.items().stream().map(NotificationResponse::from).toList(), result.total());
    }

    @PATCH
    @Path("/{id}/read")
    public Response markAsRead(@HeaderParam(CUSTOMER_HEADER) String customerId, @PathParam("id") UUID id) {
        service.markAsRead(customerId, id);
        return Response.noContent().build();
    }

    /** Endpoint interno que simula el evento de pago (origen real sin definir). */
    @POST
    public Response create(@HeaderParam(CUSTOMER_HEADER) String customerId, @Valid CreateRequest request) {
        PaymentNotification created = service.register(new PaymentEvent(customerId, request.paymentReference(),
                request.type(), request.accountNumber(), request.amount(), request.currency()));
        return Response.status(Response.Status.CREATED).entity(NotificationResponse.from(created)).build();
    }

    private static NotificationStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return NotificationStatus.valueOf(status.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw NotificationException.invalid("status debe ser UNREAD o READ");
        }
    }
}
