package com.banca.internet.cuentas.api;

import com.banca.internet.cuentas.service.CuentaNoEncontradaException;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/** Mapeo centralizado de errores de dominio a respuestas HTTP. */
public final class ManejadoresDeError {

    private ManejadoresDeError() {
    }

    @Provider
    public static class NoEncontrada implements ExceptionMapper<CuentaNoEncontradaException> {
        @Override
        public Response toResponse(CuentaNoEncontradaException e) {
            return Problema.respuesta(Response.Status.NOT_FOUND, "Cuenta no encontrada", e.getMessage());
        }
    }

    @Provider
    public static class SolicitudInvalida implements ExceptionMapper<SolicitudInvalidaException> {
        @Override
        public Response toResponse(SolicitudInvalidaException e) {
            return Problema.respuesta(Response.Status.BAD_REQUEST, "Solicitud inválida", e.getMessage());
        }
    }
}
