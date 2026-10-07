package com.banco.tarjetas.dto;

/** DTO de listado. */
public record TarjetaResumen(
        String id,
        String numeroEnmascarado,
        String tipo,
        String estado) {
}
