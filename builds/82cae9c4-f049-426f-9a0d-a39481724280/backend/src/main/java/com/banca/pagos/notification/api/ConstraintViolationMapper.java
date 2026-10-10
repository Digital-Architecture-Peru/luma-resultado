package com.banca.pagos.notification.api;

import com.banca.pagos.notification.api.dto.PaymentNotificationDtos.ErrorBody;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.stream.Collectors;

@Provider
public class ConstraintViolationMapper implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(ConstraintViolationException e) {
        String detail = e.getConstraintViolations().stream()
                .map(ConstraintViolationMapper::describe)
                .sorted()
                .collect(Collectors.joining("; "));
        return Response.status(Response.Status.BAD_REQUEST)
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorBody("INVALID_REQUEST", detail))
                .build();
    }

    private static String describe(ConstraintViolation<?> violation) {
        String path = violation.getPropertyPath().toString();
        String field = path.substring(path.lastIndexOf('.') + 1);
        return field + ": " + violation.getMessage();
    }
}
