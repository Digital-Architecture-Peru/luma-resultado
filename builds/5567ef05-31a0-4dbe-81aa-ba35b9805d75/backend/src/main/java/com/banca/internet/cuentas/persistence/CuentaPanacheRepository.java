package com.banca.internet.cuentas.persistence;

import java.util.List;
import java.util.Optional;

import com.banca.internet.cuentas.domain.Cuenta;
import com.banca.internet.cuentas.domain.CuentaRepository;

import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;

/** Adaptador Panache del puerto {@link CuentaRepository}; consultas con parámetros con nombre. */
@ApplicationScoped
public class CuentaPanacheRepository implements CuentaRepository {

    @Override
    public List<Cuenta> buscarPorCliente(long clienteId) {
        return CuentaEntity.<CuentaEntity>find("clienteId = :cliente order by id",
                        Parameters.with("cliente", clienteId))
                .list().stream()
                .map(CuentaPanacheRepository::aDominio)
                .toList();
    }

    @Override
    public Optional<Cuenta> buscarPorIdYCliente(long cuentaId, long clienteId) {
        return CuentaEntity.<CuentaEntity>find("id = :id and clienteId = :cliente",
                        Parameters.with("id", cuentaId).and("cliente", clienteId))
                .firstResultOptional()
                .map(CuentaPanacheRepository::aDominio);
    }

    private static Cuenta aDominio(CuentaEntity e) {
        return new Cuenta(e.id, e.clienteId, e.numero, e.tipo, e.moneda,
                e.saldoDisponible, e.estado, e.fechaApertura);
    }
}
