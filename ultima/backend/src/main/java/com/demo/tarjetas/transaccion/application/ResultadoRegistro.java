package com.demo.tarjetas.transaccion.application;

import com.demo.tarjetas.transaccion.domain.Transaccion;

/** Resultado de registrar: {@code repetida} indica reintento idempotente. */
public record ResultadoRegistro(Transaccion transaccion, boolean repetida) {
}
