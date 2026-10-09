package com.banco.pagos.infrastructure;

import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.PasarelaPagoPort;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;

/**
 * Stub determinista (hipótesis H4): rechaza montos sobre el límite de la demo
 * y cuentas destino terminadas en "0000". No invoca ningún sistema real.
 */
@ApplicationScoped
public class PasarelaPagoStub implements PasarelaPagoPort {

    static final BigDecimal LIMITE_DEMO = new BigDecimal("50000.00");
    static final String SUFIJO_RECHAZADO = "0000";

    @Override
    public ResultadoPasarela autorizar(Pago pago) {
        if (pago.getMonto().compareTo(LIMITE_DEMO) > 0) {
            return ResultadoPasarela.rechazado("Monto sobre el límite de la demo");
        }
        if (pago.getCuentaDestino().endsWith(SUFIJO_RECHAZADO)) {
            return ResultadoPasarela.rechazado("Cuenta destino rechazada por la pasarela");
        }
        return ResultadoPasarela.aprobado();
    }
}
