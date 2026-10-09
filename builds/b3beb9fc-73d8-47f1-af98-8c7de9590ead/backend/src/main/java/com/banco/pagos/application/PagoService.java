package com.banco.pagos.application;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.PaginaResultado;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.PagoFiltro;
import com.banco.pagos.domain.PagoRepository;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.springframework.stereotype.Service;

@Service
public class PagoService {

    public static final int TAMANO_MAXIMO = 100;

    private final PagoRepository repositorio;

    public PagoService(PagoRepository repositorio) {
        this.repositorio = repositorio;
    }

    public PaginaResultado<Pago> consultar(String cuentaId, LocalDate desde, LocalDate hasta,
                                           EstadoPago estado, int page, int size) {
        validarPaginacion(page, size);
        if (desde != null && hasta != null && desde.isAfter(hasta)) {
            throw new SolicitudInvalidaException("'desde' no puede ser posterior a 'hasta'");
        }
        PagoFiltro filtro = new PagoFiltro(inicioDelDia(desde), inicioDelDia(hasta == null ? null : hasta.plusDays(1)), estado);
        return repositorio.buscar(cuentaId, filtro, page, size);
    }

    public Pago obtener(String cuentaId, long id) {
        return repositorio.buscarPorId(cuentaId, id).orElseThrow(() -> new PagoNoEncontradoException(id));
    }

    private static void validarPaginacion(int page, int size) {
        if (page < 0) {
            throw new SolicitudInvalidaException("'page' debe ser mayor o igual a 0");
        }
        if (size < 1 || size > TAMANO_MAXIMO) {
            throw new SolicitudInvalidaException("'size' debe estar entre 1 y " + TAMANO_MAXIMO);
        }
    }

    private static OffsetDateTime inicioDelDia(LocalDate fecha) {
        return fecha == null ? null : fecha.atStartOfDay().atOffset(ZoneOffset.UTC);
    }
}
