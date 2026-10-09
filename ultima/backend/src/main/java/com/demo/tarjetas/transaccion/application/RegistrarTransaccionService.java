package com.demo.tarjetas.transaccion.application;

import com.demo.tarjetas.transaccion.domain.EstadoTransaccion;
import com.demo.tarjetas.transaccion.domain.ProcesadorTarjetasGateway;
import com.demo.tarjetas.transaccion.domain.ReglaNegocioException;
import com.demo.tarjetas.transaccion.domain.TarjetaInfo;
import com.demo.tarjetas.transaccion.domain.TarjetaNoEncontradaException;
import com.demo.tarjetas.transaccion.domain.Transaccion;
import com.demo.tarjetas.transaccion.domain.TransaccionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/** Casos de uso de transacciones de tarjeta. Depende solo de puertos. */
@ApplicationScoped
public class RegistrarTransaccionService {

    private static final int LIMITE_MAXIMO = 100;

    private final TransaccionRepository repositorio;
    private final ProcesadorTarjetasGateway procesador;

    @Inject
    public RegistrarTransaccionService(TransaccionRepository repositorio, ProcesadorTarjetasGateway procesador) {
        this.repositorio = repositorio;
        this.procesador = procesador;
    }

    public ResultadoRegistro registrar(String clienteId, long tarjetaId, BigDecimal monto,
                                       String moneda, String idempotencyKey) {
        TarjetaInfo tarjeta = tarjetaDelCliente(clienteId, tarjetaId);

        Optional<Transaccion> previa = idempotencyKey == null ? Optional.empty()
                : repositorio.buscarPorClave(idempotencyKey);
        if (previa.isPresent()) {
            return repeticion(previa.get(), tarjetaId);
        }

        Transaccion pendiente = Transaccion.nueva(tarjetaId, monto, moneda, idempotencyKey);
        if (!tarjeta.estaActiva()) {
            throw new ReglaNegocioException("La tarjeta no esta activa");
        }
        EstadoTransaccion resultado = procesador.autorizar(tarjeta, monto, moneda);
        Transaccion final_ = pendiente.conEstado(resultado);
        repositorio.guardar(final_);
        return new ResultadoRegistro(final_, false);
    }

    public List<Transaccion> historial(String clienteId, long tarjetaId, int limite) {
        tarjetaDelCliente(clienteId, tarjetaId);
        int acotado = Math.max(1, Math.min(limite, LIMITE_MAXIMO));
        return repositorio.historial(tarjetaId, acotado);
    }

    public List<TarjetaInfo> tarjetas(String clienteId) {
        return repositorio.tarjetasDeCliente(clienteId);
    }

    private ResultadoRegistro repeticion(Transaccion previa, long tarjetaId) {
        if (previa.tarjetaId() != tarjetaId) {
            throw new ReglaNegocioException("Idempotency-Key ya usada con otra tarjeta");
        }
        return new ResultadoRegistro(previa, true);
    }

    private TarjetaInfo tarjetaDelCliente(String clienteId, long tarjetaId) {
        return repositorio.buscarTarjeta(tarjetaId)
                .filter(t -> clienteId != null && t.perteneceA(clienteId))
                .orElseThrow(() -> new TarjetaNoEncontradaException(tarjetaId));
    }
}
