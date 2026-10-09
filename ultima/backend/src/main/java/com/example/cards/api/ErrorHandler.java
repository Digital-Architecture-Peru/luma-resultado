package com.example.cards.api;

import com.example.cards.domain.DomainErrors.ConcurrentUpdateException;
import com.example.cards.domain.DomainErrors.DuplicatePaymentException;
import com.example.cards.domain.DomainErrors.NotFoundException;
import com.example.cards.domain.DomainErrors.PaymentRejectedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/** Errores uniformes RFC 7807. Los errores de validación de Spring ya salen como ProblemDetail (400). */
@RestControllerAdvice
public class ErrorHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ErrorHandler.class);

    @ExceptionHandler(NotFoundException.class)
    ProblemDetail notFound(NotFoundException e) {
        return problem(HttpStatus.NOT_FOUND, "Recurso no encontrado", e.getMessage());
    }

    @ExceptionHandler(PaymentRejectedException.class)
    ProblemDetail rejected(PaymentRejectedException e) {
        return problem(HttpStatus.UNPROCESSABLE_ENTITY, "Pago rechazado", e.getMessage());
    }

    @ExceptionHandler({DuplicatePaymentException.class, DuplicateKeyException.class})
    ProblemDetail duplicate(RuntimeException e) {
        return problem(HttpStatus.CONFLICT, "Pago duplicado", "Ya existe un pago con esta Idempotency-Key");
    }

    @ExceptionHandler(ConcurrentUpdateException.class)
    ProblemDetail concurrent(ConcurrentUpdateException e) {
        return problem(HttpStatus.CONFLICT, "Conflicto de concurrencia", e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ProblemDetail badRequest(IllegalArgumentException e) {
        return problem(HttpStatus.BAD_REQUEST, "Solicitud inválida", e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail unexpected(Exception e) {
        log.error("Error inesperado", e);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno", "No se pudo procesar la solicitud");
    }

    private static ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        return pd;
    }
}
