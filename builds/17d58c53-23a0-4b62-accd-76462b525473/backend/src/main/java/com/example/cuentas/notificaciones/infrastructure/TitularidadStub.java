package com.example.cuentas.notificaciones.infrastructure;

import com.example.cuentas.notificaciones.port.TitularidadPort;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/**
 * Stub: acepta cualquier cuenta con formato válido (10 a 20 dígitos).
 * PENDIENTE: reemplazar por verificación real contra el usuario autenticado (riesgo IDOR).
 */
@Component
public class TitularidadStub implements TitularidadPort {

    private static final Pattern FORMATO = Pattern.compile("^[0-9]{10,20}$");

    @Override
    public boolean esTitular(String cuentaId) {
        return cuentaId != null && FORMATO.matcher(cuentaId).matches();
    }
}
