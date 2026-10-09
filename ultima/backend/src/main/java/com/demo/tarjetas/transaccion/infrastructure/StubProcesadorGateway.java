package com.demo.tarjetas.transaccion.infrastructure;

import com.demo.tarjetas.transaccion.domain.EstadoTransaccion;
import com.demo.tarjetas.transaccion.domain.ProcesadorTarjetasGateway;
import com.demo.tarjetas.transaccion.domain.TarjetaInfo;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/** Adaptador ficticio: aprueba montos hasta un limite configurable. Sustituir por el proveedor real. */
@ApplicationScoped
public class StubProcesadorGateway implements ProcesadorTarjetasGateway {

    private final BigDecimal limite;

    @Inject
    public StubProcesadorGateway(@ConfigProperty(name = "tarjetas.stub.limite") BigDecimal limite) {
        this.limite = limite;
    }

    @Override
    public EstadoTransaccion autorizar(TarjetaInfo tarjeta, BigDecimal monto, String moneda) {
        return monto.compareTo(limite) <= 0 ? EstadoTransaccion.APROBADA : EstadoTransaccion.RECHAZADA;
    }
}
