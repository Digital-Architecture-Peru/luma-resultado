package com.example.tarjetas.notificaciones.service;

import com.example.tarjetas.notificaciones.domain.Notificacion;
import com.example.tarjetas.notificaciones.domain.NotificacionNoEncontradaException;
import com.example.tarjetas.notificaciones.domain.Pagina;
import com.example.tarjetas.notificaciones.port.NotificacionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class NotificacionService {

    static final int TAMANO_MAXIMO = 100;

    private final NotificacionRepository repositorio;

    @Inject
    public NotificacionService(NotificacionRepository repositorio) {
        this.repositorio = repositorio;
    }

    public Pagina<Notificacion> listar(String tarjetaId, Boolean leida, int page, int size) {
        if (tarjetaId == null || tarjetaId.isBlank()) {
            throw new IllegalArgumentException("tarjetaId es obligatorio");
        }
        if (page < 0) {
            throw new IllegalArgumentException("page no puede ser negativo");
        }
        if (size < 1 || size > TAMANO_MAXIMO) {
            throw new IllegalArgumentException("size debe estar entre 1 y " + TAMANO_MAXIMO);
        }
        long total = repositorio.contar(tarjetaId, leida);
        List<Notificacion> items = total == 0
                ? List.of()
                : repositorio.buscar(tarjetaId, leida, page * size, size);
        return new Pagina<>(items, page, size, total);
    }

    public Notificacion marcarLeida(long id) {
        return repositorio.marcarLeida(id)
                .orElseThrow(() -> new NotificacionNoEncontradaException(id));
    }
}
