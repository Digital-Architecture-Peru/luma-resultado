package com.banco.tarjetas.model;

import com.banco.tarjetas.service.SolicitudInvalidaException;

import java.util.Locale;

public enum EstadoTarjeta {
    ACTIVA,
    BLOQUEADA,
    VENCIDA;

    public static EstadoTarjeta desde(String valor) {
        try {
            return EstadoTarjeta.valueOf(valor.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new SolicitudInvalidaException("Estado no válido: '" + valor + "'. Use ACTIVA, BLOQUEADA o VENCIDA.");
        }
    }
}
