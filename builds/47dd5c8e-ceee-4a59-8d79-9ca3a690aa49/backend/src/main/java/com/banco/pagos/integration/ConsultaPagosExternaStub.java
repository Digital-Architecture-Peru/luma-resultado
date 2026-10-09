package com.banco.pagos.integration;

import com.banco.pagos.domain.Pago;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ConsultaPagosExternaStub implements ConsultaPagosExternaPort {

    @Override
    public List<Pago> consultarPendientes(String clienteId) {
        return List.of();
    }
}
