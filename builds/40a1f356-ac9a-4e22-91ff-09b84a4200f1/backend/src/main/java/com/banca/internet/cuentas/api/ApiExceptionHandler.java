package com.banca.internet.cuentas.api;

import com.banca.internet.cuentas.service.CuentaNoEncontradaException;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/** Errores uniformes RFC 7807; no expone excepciones internas. */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(CuentaNoEncontradaException.class)
    public ProblemDetail noEncontrada(CuentaNoEncontradaException ex) {
        return problema(HttpStatus.NOT_FOUND, "Cuenta no encontrada", ex.getMessage());
    }

    @ExceptionHandler({ConstraintViolationException.class, IllegalArgumentException.class,
            MethodArgumentTypeMismatchException.class})
    public ProblemDetail solicitudInvalida(Exception ex) {
        return problema(HttpStatus.BAD_REQUEST, "Solicitud inválida", "Parámetros de la solicitud no válidos");
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail inesperado(Exception ex) {
        LOG.error("Error inesperado", ex);
        return problema(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno", "Ocurrió un error inesperado");
    }

    private static ProblemDetail problema(HttpStatus estado, String titulo, String detalle) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(estado, detalle);
        pd.setTitle(titulo);
        return pd;
    }
}
