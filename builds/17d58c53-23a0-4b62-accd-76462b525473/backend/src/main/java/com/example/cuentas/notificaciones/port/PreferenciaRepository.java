package com.example.cuentas.notificaciones.port;

import com.example.cuentas.notificaciones.domain.Preferencia;
import java.util.List;

public interface PreferenciaRepository {

    List<Preferencia> listar(String cuentaId);

    void guardar(Preferencia preferencia);
}
