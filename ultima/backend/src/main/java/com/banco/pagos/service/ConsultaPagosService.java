package com.banco.pagos.service;

import com.banco.pagos.api.PagoDto;
import com.banco.pagos.api.PaginaDto;
import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.FiltroPagos;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.repository.PagoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;

@ApplicationScoped
public class ConsultaPagosService {

    public static final int MAX_SIZE = 100;

    private final PagoRepository repositorio;

    public ConsultaPagosService(PagoRepository repositorio) {
        this.repositorio = repositorio;
    }

    public PaginaDto<PagoDto> consultar(ConsultaPagos consulta) {
        validarPaginacion(consulta.page(), consulta.size());
        FiltroPagos filtro = construirFiltro(consulta);

        List<PagoDto> contenido = repositorio.buscar(filtro, consulta.page(), consulta.size())
                .stream()
                .map(PagoDto::desde)
                .toList();
        long total = repositorio.contar(filtro);
        return PaginaDto.de(contenido, consulta.page(), consulta.size(), total);
    }

    /**
     * Devuelve el pago solo si pertenece a la cuenta indicada (evita IDOR).
     * TODO: reemplazar el parametro cuentaId por la identidad entregada por el gateway/BFF (H3).
     */
    public PagoDto obtener(Long id, String cuentaId) {
        requerirCuenta(cuentaId);
        Pago pago = repositorio.porId(id)
                .filter(p -> p.cuentaId.equals(cuentaId))
                .orElseThrow(() -> ConsultaException.noEncontrado("No existe el pago " + id));
        return PagoDto.desde(pago);
    }

    private static FiltroPagos construirFiltro(ConsultaPagos c) {
        requerirCuenta(c.cuentaId());
        Instant desde = parsearFecha(c.desde(), "desde");
        Instant hasta = parsearFecha(c.hasta(), "hasta");
        if (desde != null && hasta != null && desde.isAfter(hasta)) {
            throw ConsultaException.parametroInvalido("'desde' no puede ser posterior a 'hasta'");
        }
        return new FiltroPagos(c.cuentaId(), desde, hasta, parsearEstado(c.estado()));
    }

    private static void requerirCuenta(String cuentaId) {
        if (cuentaId == null || cuentaId.isBlank()) {
            throw ConsultaException.parametroInvalido("'cuentaId' es obligatorio");
        }
    }

    private static void validarPaginacion(int page, int size) {
        if (page < 0) {
            throw ConsultaException.parametroInvalido("'page' debe ser >= 0");
        }
        if (size < 1 || size > MAX_SIZE) {
            throw ConsultaException.parametroInvalido("'size' debe estar entre 1 y " + MAX_SIZE);
        }
    }

    private static Instant parsearFecha(String valor, String nombre) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        try {
            return Instant.parse(valor);
        } catch (DateTimeParseException e) {
            throw ConsultaException.parametroInvalido("'" + nombre + "' debe ser ISO-8601 UTC, ej. 2026-10-01T00:00:00Z");
        }
    }

    private static EstadoPago parsearEstado(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        try {
            return EstadoPago.valueOf(valor.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ConsultaException.parametroInvalido("'estado' no es valido: " + valor);
        }
    }
}
