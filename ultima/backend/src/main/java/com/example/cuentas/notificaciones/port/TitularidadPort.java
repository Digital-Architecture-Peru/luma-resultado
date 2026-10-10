package com.example.cuentas.notificaciones.port;

/** Verifica que la cuenta pertenece al usuario autenticado (autenticación fuera de alcance). */
public interface TitularidadPort {

    boolean esTitular(String cuentaId);
}
