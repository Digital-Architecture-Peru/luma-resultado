package com.banco.pagos.support;

import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.PagoRepository;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/** Doble de prueba del puerto de persistencia. */
public class InMemoryPagoRepository implements PagoRepository {

    private final Map<UUID, Pago> datos = new LinkedHashMap<>();
    public int guardados = 0;

    @Override
    public Pago guardar(Pago pago) {
        guardados++;
        datos.put(pago.getId(), pago);
        return pago;
    }

    @Override
    public Optional<Pago> buscarPorId(UUID id) {
        return Optional.ofNullable(datos.get(id));
    }

    @Override
    public Optional<Pago> buscarPorIdempotencyKey(String idempotencyKey) {
        return datos.values().stream().filter(p -> p.getIdempotencyKey().equals(idempotencyKey)).findFirst();
    }

    @Override
    public List<Pago> listarPorCuentaOrigen(String cuentaOrigen, int limite) {
        return datos.values().stream()
                .filter(p -> p.getCuentaOrigen().equals(cuentaOrigen))
                .sorted(Comparator.comparing(Pago::getCreadoEn).reversed())
                .limit(limite)
                .toList();
    }
}
