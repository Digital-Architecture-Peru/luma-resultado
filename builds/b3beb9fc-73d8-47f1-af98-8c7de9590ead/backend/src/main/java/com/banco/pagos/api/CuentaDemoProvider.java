package com.banco.pagos.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Implementación de demo (H1): cuenta ficticia fija. Sustituir por la identidad del token en producción. */
@Component
public class CuentaDemoProvider implements CuentaActualProvider {

    private final String cuentaId;

    public CuentaDemoProvider(@Value("${app.demo.cuenta-id}") String cuentaId) {
        this.cuentaId = cuentaId;
    }

    @Override
    public String cuentaId() {
        return cuentaId;
    }
}
