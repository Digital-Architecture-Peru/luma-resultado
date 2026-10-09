package com.banco.pagos.service;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.FiltroPagos;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.Pagina;
import com.banco.pagos.repository.PagoRepository;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PagoService {

    public static final int TAMANO_MAXIMO = 100;
    private static final int LONGITUD_MAXIMA_CLIENTE = 40;

    private final PagoRepository repository;

    public PagoService(PagoRepository repository) {
        this.repository = repository;
    }

    public Pagina<Pago> listar(String clienteId, EstadoPago estado, LocalDate desde, LocalDate hasta,
                               int page, int size) {
        validarCliente(clienteId);
        if (page < 0) {
            throw new IllegalArgumentException("page debe ser >= 0");
        }
        if (size < 1 || size > TAMANO_MAXIMO) {
            throw new IllegalArgumentException("size debe estar entre 1 y " + TAMANO_MAXIMO);
        }
        if (desde != null && hasta != null && desde.isAfter(hasta)) {
            throw new IllegalArgumentException("desde no puede ser posterior a hasta");
        }
        OffsetDateTime inicio = desde == null ? null : desde.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime finExclusivo = hasta == null ? null : hasta.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);
        return repository.listar(new FiltroPagos(clienteId, estado, inicio, finExclusivo), page, size);
    }

    public Pago obtener(String clienteId, UUID id) {
        validarCliente(clienteId);
        return repository.buscarPorId(clienteId, id).orElseThrow(() -> new PagoNoEncontradoException(id));
    }

    private void validarCliente(String clienteId) {
        if (clienteId == null || clienteId.isBlank() || clienteId.length() > LONGITUD_MAXIMA_CLIENTE) {
            throw new IllegalArgumentException("X-Cliente-Id es obligatorio (máx. " + LONGITUD_MAXIMA_CLIENTE + ")");
        }
    }
}
