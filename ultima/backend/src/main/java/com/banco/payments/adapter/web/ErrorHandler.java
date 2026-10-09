package com.banco.payments.adapter.web;

import com.banco.payments.application.PaymentErrors;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/** Contrato de error uniforme (RFC 7807). No expone excepciones internas. */
@RestControllerAdvice
public class ErrorHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ErrorHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ProblemDetail> validation(MethodArgumentNotValidException e) {
        String detail = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getDefaultMessage())
                .sorted()
                .collect(Collectors.joining("; "));
        return problem(HttpStatus.BAD_REQUEST, "Solicitud invalida", detail);
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    ResponseEntity<ProblemDetail> missingHeader(MissingRequestHeaderException e) {
        return problem(HttpStatus.BAD_REQUEST, "Cabecera faltante", "Falta la cabecera " + e.getHeaderName());
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    ResponseEntity<ProblemDetail> unreadable(Exception e) {
        return problem(HttpStatus.BAD_REQUEST, "Solicitud invalida", "El cuerpo o los parametros no son validos");
    }

    @ExceptionHandler(PaymentErrors.InvalidPayment.class)
    ResponseEntity<ProblemDetail> invalid(PaymentErrors.InvalidPayment e) {
        return problem(HttpStatus.BAD_REQUEST, "Pago invalido", e.getMessage());
    }

    @ExceptionHandler(PaymentErrors.NotFound.class)
    ResponseEntity<ProblemDetail> notFound(PaymentErrors.NotFound e) {
        return problem(HttpStatus.NOT_FOUND, "No encontrado", e.getMessage());
    }

    @ExceptionHandler(PaymentErrors.InsufficientFunds.class)
    ResponseEntity<ProblemDetail> insufficient(PaymentErrors.InsufficientFunds e) {
        return problem(HttpStatus.UNPROCESSABLE_ENTITY, "Saldo insuficiente", e.getMessage());
    }

    @ExceptionHandler({PaymentErrors.IdempotencyConflict.class, PaymentErrors.ConcurrentUpdate.class})
    ResponseEntity<ProblemDetail> conflict(RuntimeException e) {
        return problem(HttpStatus.CONFLICT, "Conflicto", e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ProblemDetail> unexpected(Exception e) {
        LOG.error("Error no controlado", e);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno", "No fue posible procesar la solicitud");
    }

    private static ResponseEntity<ProblemDetail> problem(HttpStatus status, String title, String detail) {
        ProblemDetail body = ProblemDetail.forStatusAndDetail(status, detail);
        body.setTitle(title);
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_PROBLEM_JSON).body(body);
    }
}
