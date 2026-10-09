package com.demo.tarjetas.transaccion.api;

import java.math.BigDecimal;

/** Cuerpo del POST. La validacion de negocio vive en el dominio. */
public record SolicitudTransaccion(BigDecimal monto, String moneda) {
}
