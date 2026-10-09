package com.banco.pagos.api;

import com.banco.pagos.service.PagoNoEncontradoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(PagoNoEncontradoException.class)
    public ProblemDetail noEncontrado(PagoNoEncontradoException ex) {
        return problema(HttpStatus.NOT_FOUND, "Pago no encontrado", ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail argumentoInvalido(IllegalArgumentException ex) {
        return problema(HttpStatus.BAD_REQUEST, "Solicitud inválida", ex.getMessage());
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ProblemDetail headerFaltante(MissingRequestHeaderException ex) {
        return problema(HttpStatus.BAD_REQUEST, "Solicitud inválida", "Falta el header " + ex.getHeaderName());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail tipoInvalido(MethodArgumentTypeMismatchException ex) {
        return problema(HttpStatus.BAD_REQUEST, "Solicitud inválida", "Valor inválido para " + ex.getName());
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail inesperado(Exception ex) {
        LOG.error("Error inesperado", ex);
        return problema(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno", "Ocurrió un error inesperado");
    }

    private ProblemDetail problema(HttpStatus status, String titulo, String detalle) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detalle);
        pd.setTitle(titulo);
        return pd;
    }
}
