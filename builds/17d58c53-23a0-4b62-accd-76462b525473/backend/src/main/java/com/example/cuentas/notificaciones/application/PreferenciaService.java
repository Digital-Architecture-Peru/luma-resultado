package com.example.cuentas.notificaciones.application;

import com.example.cuentas.notificaciones.domain.Preferencia;
import com.example.cuentas.notificaciones.port.PreferenciaRepository;
import com.example.cuentas.notificaciones.port.TitularidadPort;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PreferenciaService {

    private final PreferenciaRepository preferencias;
    private final TitularidadPort titularidad;

    public PreferenciaService(PreferenciaRepository preferencias, TitularidadPort titularidad) {
        this.preferencias = preferencias;
        this.titularidad = titularidad;
    }

    public List<Preferencia> listar(String cuentaId) {
        validarTitular(cuentaId);
        return preferencias.listar(cuentaId);
    }

    public Preferencia actualizar(Preferencia preferencia) {
        validarTitular(preferencia.cuentaId());
        preferencias.guardar(preferencia);
        return preferencia;
    }

    private void validarTitular(String cuentaId) {
        if (!titularidad.esTitular(cuentaId)) {
            throw new CuentaNoAutorizadaException();
        }
    }
}
