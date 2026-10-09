package com.example.accounts.api;

import com.example.accounts.domain.BusinessRuleException;
import jakarta.validation.ConstraintViolationException;
import java.net.URI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ApiExceptionHandler.class);
    private static final String TYPE_BASE = "https://example.com/problems/";

    @ExceptionHandler(BusinessRuleException.class)
    ProblemDetail handleBusiness(BusinessRuleException ex) {
        return problem(HttpStatus.valueOf(ex.code().httpStatus()), ex.code().name(), ex.getMessage());
    }

    @ExceptionHandler(DuplicateKeyException.class)
    ProblemDetail handleDuplicateKey(DuplicateKeyException ex) {
        return problem(HttpStatus.CONFLICT, "DUPLICATE_TRANSFER", "La clave de idempotencia ya fue utilizada");
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ProblemDetail handleConstraint(ConstraintViolationException ex) {
        return problem(HttpStatus.UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", "Parámetros inválidos");
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail handleUnexpected(Exception ex) {
        LOG.error("Error no controlado", ex);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Error interno");
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        String detail = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b).orElse("Solicitud inválida");
        return ResponseEntity.unprocessableEntity()
                .body(problem(HttpStatus.UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", detail));
    }

    private static ProblemDetail problem(HttpStatus status, String code, String detail) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(code);
        pd.setType(URI.create(TYPE_BASE + code.toLowerCase().replace('_', '-')));
        return pd;
    }
}
