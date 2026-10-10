package com.example.cuentas.notificaciones.application;

import com.example.cuentas.notificaciones.domain.Notificacion;
import com.example.cuentas.notificaciones.domain.Pagina;
import com.example.cuentas.notificaciones.domain.TipoEvento;
import com.example.cuentas.notificaciones.port.CanalNotificacionPort;
import com.example.cuentas.notificaciones.port.NotificacionRepository;
import com.example.cuentas.notificaciones.port.PreferenciaRepository;
import com.example.cuentas.notificaciones.port.TitularidadPort;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class NotificacionService {

    static final int TAMANO_MAXIMO = 100;

    private final NotificacionRepository notificaciones;
    private final PreferenciaRepository preferencias;
    private final CanalNotificacionPort canal;
    private final TitularidadPort titularidad;

    public NotificacionService(NotificacionRepository notificaciones,
                               PreferenciaRepository preferencias,
                               CanalNotificacionPort canal,
                               TitularidadPort titularidad) {
        this.notificaciones = notificaciones;
        this.preferencias = preferencias;
        this.canal = canal;
        this.titularidad = titularidad;
    }

    public Pagina<Notificacion> listar(String cuentaId, Boolean leida, int page, int size) {
        validarTitular(cuentaId);
        if (page < 0 || size < 1 || size > TAMANO_MAXIMO) {
            throw new IllegalArgumentException("Paginación inválida: page >= 0 y size entre 1 y " + TAMANO_MAXIMO);
        }
        return notificaciones.buscar(cuentaId, leida, page, size);
    }

    public Notificacion marcarLeida(UUID id) {
        Notificacion actual = notificaciones.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Notificación no encontrada"));
        validarTitular(actual.cuentaId());
        if (actual.leida()) {
            return actual;
        }
        notificaciones.marcarLeida(id);
        return actual.comoLeida();
    }

    /** Registra un evento (simulado con datos semilla) y lo entrega por los canales activos. */
    public Notificacion registrar(String cuentaId, TipoEvento tipo, String mensaje, BigDecimal monto) {
        validarTitular(cuentaId);
        Notificacion nueva = Notificacion.nueva(cuentaId, tipo, mensaje, monto);
        notificaciones.guardar(nueva);
        preferencias.listar(cuentaId).stream()
                .filter(p -> p.aplicaA(tipo, monto))
                .forEach(p -> canal.enviar(nueva, p.canal()));
        return nueva;
    }

    private void validarTitular(String cuentaId) {
        if (!titularidad.esTitular(cuentaId)) {
            throw new CuentaNoAutorizadaException();
        }
    }
}
