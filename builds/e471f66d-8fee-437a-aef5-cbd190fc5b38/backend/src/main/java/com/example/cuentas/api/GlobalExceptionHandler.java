package com.example.cuentas.api;

import com.example.cuentas.domain.DomainException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/** Errores uniformes RFC 7807 (problem+json); no expone excepciones internas. */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(DomainException.class)
    ResponseEntity<ProblemDetail> handleDomain(DomainException ex) {
        HttpStatus status = switch (ex.getKind()) {
            case BUSINESS_RULE -> HttpStatus.UNPROCESSABLE_ENTITY;
            case NOT_FOUND -> HttpStatus.NOT_FOUND;
            case IDEMPOTENCY_CONFLICT -> HttpStatus.CONFLICT;
        };
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, ex.getMessage());
        problem.setTitle(ex.getCode());
        problem.setProperty("code", ex.getCode());
        return ResponseEntity.status(status).body(problem);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ProblemDetail> handleBadRequest(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("BAD_REQUEST");
        return ResponseEntity.badRequest().body(problem);
    }

    /** Carrera de dos reintentos con la misma clave: gana uno, el otro recibe 409. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ProblemDetail> handleIntegrity(DataIntegrityViolationException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
                "Solicitud concurrente en conflicto; reintente con la misma clave.");
        problem.setTitle("CONCURRENT_REQUEST");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
    }
}
