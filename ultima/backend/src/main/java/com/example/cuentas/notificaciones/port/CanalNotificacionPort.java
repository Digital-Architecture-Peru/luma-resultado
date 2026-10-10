package com.example.cuentas.notificaciones.port;

import com.example.cuentas.notificaciones.domain.Canal;
import com.example.cuentas.notificaciones.domain.Notificacion;

/** Puerto de entrega por canal. La integración real está sin definir. */
public interface CanalNotificacionPort {

    void enviar(Notificacion notificacion, Canal canal);
}
