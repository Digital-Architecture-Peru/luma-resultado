package com.banco.pagos.api;

/** Resuelve la cuenta del usuario autenticado. Nunca se toma de la petición. */
public interface CuentaActualProvider {

    String cuentaId();
}
