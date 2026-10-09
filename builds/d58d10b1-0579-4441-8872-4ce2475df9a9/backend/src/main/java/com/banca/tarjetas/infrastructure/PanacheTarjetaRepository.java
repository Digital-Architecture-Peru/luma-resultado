package com.banca.tarjetas.infrastructure;

import com.banca.tarjetas.domain.Tarjeta;
import com.banca.tarjetas.domain.TarjetaRepository;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Adaptador PostgreSQL. Consultas siempre parametrizadas. */
@ApplicationScoped
public class PanacheTarjetaRepository
        implements TarjetaRepository, PanacheRepositoryBase<TarjetaEntity, UUID> {

    @Override
    public List<Tarjeta> buscarPorCliente(UUID clienteId) {
        return find("clienteId = ?1 order by vencimiento desc", clienteId).stream()
                .map(TarjetaEntity::aDominio)
                .toList();
    }

    @Override
    public Optional<Tarjeta> buscarPorIdYCliente(UUID id, UUID clienteId) {
        return find("id = ?1 and clienteId = ?2", id, clienteId)
                .firstResultOptional()
                .map(TarjetaEntity::aDominio);
    }
}
