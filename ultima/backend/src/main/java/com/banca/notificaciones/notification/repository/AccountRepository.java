package com.banca.notificaciones.notification.repository;

/** Puerto de consulta de cuentas (solo existencia). */
public interface AccountRepository {

    boolean exists(String accountId);
}
