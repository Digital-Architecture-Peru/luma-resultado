package com.banca.pagos.notification.api;

import com.banca.pagos.notification.api.dto.PaymentNotificationDtos.ErrorBody;
import com.banca.pagos.notification.service.NotificationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NotificationExceptionMapper implements ExceptionMapper<NotificationException> {

    @Override
    public Response toResponse(NotificationException e) {
        return Response.status(e.code().httpStatus())
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorBody(e.code().name(), e.getMessage()))
                .build();
    }
}
