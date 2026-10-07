package com.banco.tarjetas.controller;

import com.banco.tarjetas.service.TarjetaNoEncontradaException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/** Errores uniformes (problem+json) sin exponer detalles internos. */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(TarjetaNoEncontradaException.class)
    public ProblemDetail noEncontrada(TarjetaNoEncontradaException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setTitle("Tarjeta no encontrada");
        return pd;
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail parametroInvalido(MethodArgumentTypeMismatchException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
                "Valor inválido para el parámetro '" + ex.getName() + "'");
        pd.setTitle("Parámetro inválido");
        return pd;
    }
}
