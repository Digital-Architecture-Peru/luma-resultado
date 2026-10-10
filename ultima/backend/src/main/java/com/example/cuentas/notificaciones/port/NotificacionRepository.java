package com.example.cuentas.notificaciones.port;

import com.example.cuentas.notificaciones.domain.Notificacion;
import com.example.cuentas.notificaciones.domain.Pagina;
import java.util.Optional;
import java.util.UUID;

public interface NotificacionRepository {

    Pagina<Notificacion> buscar(String cuentaId, Boolean leida, int page, int size);

    Optional<Notificacion> buscarPorId(UUID id);

    void guardar(Notificacion notificacion);

    void marcarLeida(UUID id);
}
