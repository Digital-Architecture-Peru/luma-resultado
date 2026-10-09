package com.banco.pagos.service;

/** Parametros crudos de la consulta tal como llegan por HTTP (fechas ISO-8601, estado por nombre). */
public record ConsultaPagos(String cuentaId, String desde, String hasta, String estado, int page, int size) {
}
