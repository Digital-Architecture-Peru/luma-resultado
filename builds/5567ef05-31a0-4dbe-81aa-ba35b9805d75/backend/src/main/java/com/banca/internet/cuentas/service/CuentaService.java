package com.banca.internet.cuentas.service;

import java.util.List;

import com.banca.internet.cuentas.domain.Cuenta;
import com.banca.internet.cuentas.domain.CuentaRepository;

import jakarta.enterprise.context.ApplicationScoped;

/** Casos de uso de consulta. Siempre filtra por cliente. */
@ApplicationScoped
public class CuentaService {

    private final CuentaRepository repositorio;

    public CuentaService(CuentaRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Cuenta> listar(long clienteId) {
        return repositorio.buscarPorCliente(clienteId);
    }

    public Cuenta obtener(long clienteId, long cuentaId) {
        return repositorio.buscarPorIdYCliente(cuentaId, clienteId)
                .orElseThrow(() -> new CuentaNoEncontradaException(cuentaId));
    }
}
