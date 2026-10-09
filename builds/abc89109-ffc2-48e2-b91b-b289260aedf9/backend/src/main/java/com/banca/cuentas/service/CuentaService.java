package com.banca.cuentas.service;

import com.banca.cuentas.domain.Cuenta;
import com.banca.cuentas.persistence.CuentaRepository;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class CuentaService {

    private static final Pattern CLIENTE_ID_VALIDO = Pattern.compile("^[A-Za-z0-9-]{1,20}$");

    private final CuentaRepository repositorio;

    public CuentaService(CuentaRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Cuenta> listarPorCliente(String clienteId) {
        if (clienteId == null || !CLIENTE_ID_VALIDO.matcher(clienteId).matches()) {
            throw new IllegalArgumentException("clienteId invalido: use 1 a 20 caracteres alfanumericos o guion");
        }
        return repositorio.buscarPorCliente(clienteId);
    }

    public Cuenta obtener(UUID id) {
        return repositorio.buscarPorId(id).orElseThrow(() -> new CuentaNoEncontradaException(id));
    }
}
