package com.banco.pagos.application;

import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.PagoException;
import com.banco.pagos.domain.PagoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

/** Consultas de pagos (lado lectura). */
@ApplicationScoped
public class ConsultarPagoUseCase {

    public static final int LIMITE_LISTADO = 50;

    private final PagoRepository repositorio;

    public ConsultarPagoUseCase(PagoRepository repositorio) {
        this.repositorio = repositorio;
    }

    public Pago porId(UUID id) {
        return repositorio.buscarPorId(id)
                .orElseThrow(() -> new PagoException.NoEncontrado("No existe el pago " + id));
    }

    public List<Pago> porCuentaOrigen(String cuentaOrigen) {
        if (cuentaOrigen == null || cuentaOrigen.isBlank()) {
            throw new PagoException.Invalido("cuentaOrigen es obligatoria");
        }
        return repositorio.listarPorCuentaOrigen(cuentaOrigen, LIMITE_LISTADO);
    }
}
