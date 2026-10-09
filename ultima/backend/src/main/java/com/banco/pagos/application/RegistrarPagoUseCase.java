package com.banco.pagos.application;

import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.PagoException;
import com.banco.pagos.domain.PagoRepository;
import com.banco.pagos.domain.PasarelaPagoPort;
import com.banco.pagos.domain.PasarelaPagoPort.ResultadoPasarela;
import com.banco.pagos.domain.ReglasPago;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import java.util.Optional;
import org.jboss.logging.Logger;

/** Registra un pago de forma idempotente y lo envía a la pasarela. */
@ApplicationScoped
public class RegistrarPagoUseCase {

    private static final Logger LOG = Logger.getLogger(RegistrarPagoUseCase.class);
    private static final int LONGITUD_MAXIMA_CLAVE = 64;

    private final PagoRepository repositorio;
    private final PasarelaPagoPort pasarela;

    public RegistrarPagoUseCase(PagoRepository repositorio, PasarelaPagoPort pasarela) {
        this.repositorio = repositorio;
        this.pasarela = pasarela;
    }

    public record Comando(String idempotencyKey, String cuentaOrigen, String cuentaDestino,
                          BigDecimal monto, String moneda) {
    }

    /** @param creado false cuando se reutilizó un pago previo con la misma clave. */
    public record Resultado(Pago pago, boolean creado) {
    }

    public Resultado ejecutar(Comando comando) {
        validarClave(comando.idempotencyKey());

        Optional<Pago> existente = repositorio.buscarPorIdempotencyKey(comando.idempotencyKey());
        if (existente.isPresent()) {
            return reutilizar(existente.get(), comando);
        }

        ReglasPago.validar(comando.cuentaOrigen(), comando.cuentaDestino(), comando.monto(), comando.moneda());
        Pago pago = Pago.nuevo(comando.idempotencyKey(), comando.cuentaOrigen(), comando.cuentaDestino(),
                comando.monto(), comando.moneda());
        repositorio.guardar(pago);

        ResultadoPasarela respuesta = pasarela.autorizar(pago);
        if (respuesta.autorizado()) {
            pago.confirmar();
        } else {
            pago.rechazar();
        }
        repositorio.guardar(pago);
        LOG.infof("Pago %s resuelto como %s", pago.getId(), pago.getEstado());
        return new Resultado(pago, true);
    }

    private Resultado reutilizar(Pago existente, Comando comando) {
        boolean igual = existente.mismosDatosQue(comando.cuentaOrigen(), comando.cuentaDestino(),
                comando.monto() == null ? BigDecimal.ZERO : comando.monto(), comando.moneda());
        if (!igual) {
            throw new PagoException.ConflictoIdempotencia(
                    "La Idempotency-Key ya fue usada con datos distintos");
        }
        return new Resultado(existente, false);
    }

    private static void validarClave(String clave) {
        if (clave == null || clave.isBlank() || clave.length() > LONGITUD_MAXIMA_CLAVE) {
            throw new PagoException.Invalido(
                    "La cabecera Idempotency-Key es obligatoria (máximo " + LONGITUD_MAXIMA_CLAVE + " caracteres)");
        }
    }
}
