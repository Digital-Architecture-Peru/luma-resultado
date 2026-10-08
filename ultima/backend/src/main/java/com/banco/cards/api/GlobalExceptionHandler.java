package com.banco.cards.api;

import com.banco.cards.security.MissingCustomerException;
import com.banco.cards.service.CardNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/** Errores uniformes RFC 7807 sin exponer detalles internos. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(CardNotFoundException.class)
    public ResponseEntity<ProblemDetail> notFound(CardNotFoundException ex) {
        return problem(HttpStatus.NOT_FOUND, "Tarjeta no encontrada", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ProblemDetail> badId(MethodArgumentTypeMismatchException ex) {
        return problem(HttpStatus.BAD_REQUEST, "Solicitud inválida", "El identificador de tarjeta no es válido");
    }

    @ExceptionHandler(MissingCustomerException.class)
    public ResponseEntity<ProblemDetail> unauthorized(MissingCustomerException ex) {
        return problem(HttpStatus.UNAUTHORIZED, "No autenticado", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> unexpected(Exception ex) {
        log.error("Error inesperado: {}", ex.getClass().getSimpleName());
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno", "No fue posible procesar la solicitud");
    }

    private ResponseEntity<ProblemDetail> problem(HttpStatus status, String title, String detail) {
        ProblemDetail body = ProblemDetail.forStatusAndDetail(status, detail);
        body.setTitle(title);
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_PROBLEM_JSON).body(body);
    }
}
