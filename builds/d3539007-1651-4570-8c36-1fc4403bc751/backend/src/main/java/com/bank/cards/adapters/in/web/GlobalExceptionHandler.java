package com.bank.cards.adapters.in.web;

import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.bank.cards.application.BusinessRuleException;
import com.bank.cards.application.CardNotFoundException;
import com.bank.cards.application.IdempotencyConflictException;

/** Errores RFC 7807 sin exponer detalles internos. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String INVALID_TITLE = "Solicitud invalida";

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail onValidation(MethodArgumentNotValidException ex) {
        String detail = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .sorted()
                .collect(Collectors.joining("; "));
        return problem(HttpStatus.BAD_REQUEST, INVALID_TITLE, detail);
    }

    /** Spring 6.1+: validacion de parametros del metodo (cuerpo con @Valid + restricciones en encabezados). */
    @ExceptionHandler(HandlerMethodValidationException.class)
    ProblemDetail onMethodValidation(HandlerMethodValidationException ex) {
        String detail = ex.getAllValidationResults().stream()
                .flatMap(result -> result.getResolvableErrors().stream())
                .map(GlobalExceptionHandler::describe)
                .sorted()
                .collect(Collectors.joining("; "));
        return problem(HttpStatus.BAD_REQUEST, INVALID_TITLE, detail);
    }

    @ExceptionHandler({MissingRequestHeaderException.class, HttpMessageNotReadableException.class,
            MethodArgumentTypeMismatchException.class})
    ProblemDetail onBadRequest(Exception ex) {
        return problem(HttpStatus.BAD_REQUEST, INVALID_TITLE, "Encabezado, cuerpo o parametro invalido");
    }

    @ExceptionHandler(CardNotFoundException.class)
    ProblemDetail onNotFound(CardNotFoundException ex) {
        return problem(HttpStatus.NOT_FOUND, "Tarjeta no encontrada", ex.getMessage());
    }

    @ExceptionHandler({IdempotencyConflictException.class, DuplicateKeyException.class})
    ProblemDetail onConflict(Exception ex) {
        return problem(HttpStatus.CONFLICT, "Conflicto de idempotencia",
                "La clave Idempotency-Key ya fue utilizada");
    }

    @ExceptionHandler(BusinessRuleException.class)
    ProblemDetail onBusinessRule(BusinessRuleException ex) {
        return problem(HttpStatus.UNPROCESSABLE_ENTITY, "Regla de negocio incumplida", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail onUnexpected(Exception ex) {
        LOG.error("Error inesperado", ex);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno", "Ocurrio un error inesperado");
    }

    private static String describe(MessageSourceResolvable error) {
        if (error instanceof FieldError fieldError) {
            return fieldError.getField() + ": " + fieldError.getDefaultMessage();
        }
        return String.valueOf(error.getDefaultMessage());
    }

    private static ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        return pd;
    }
}
