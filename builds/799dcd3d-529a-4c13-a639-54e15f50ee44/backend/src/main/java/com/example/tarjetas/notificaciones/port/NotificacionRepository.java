package com.example.tarjetas.notificaciones.port;

import com.example.tarjetas.notificaciones.domain.Notificacion;
import java.util.List;
import java.util.Optional;

/** Puerto de persistencia. La implementación concreta vive en infra. */
public interface NotificacionRepository {

    /** @param leida null = sin filtro */
    List<Notificacion> buscar(String tarjetaId, Boolean leida, int offset, int limit);

    long contar(String tarjetaId, Boolean leida);

    /** Marca como leída y devuelve el resultado; vacío si el id no existe. */
    Optional<Notificacion> marcarLeida(long id);
}
