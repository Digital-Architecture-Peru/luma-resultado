package com.banca.internet.cuentas.service;

import com.banca.internet.cuentas.domain.Cuenta;
import com.banca.internet.cuentas.dto.CuentaDto;
import com.banca.internet.cuentas.dto.PaginaCuentasDto;
import com.banca.internet.cuentas.repository.CuentaRepository;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CuentaService {

    private static final int DIGITOS_VISIBLES = 4;
    private static final String MASCARA = "****";

    private final CuentaRepository repository;

    public CuentaService(CuentaRepository repository) {
        this.repository = repository;
    }

    public PaginaCuentasDto listar(String clienteId, int pagina, int tamanio) {
        exigirCliente(clienteId);
        PageRequest solicitud = PageRequest.of(pagina, tamanio, Sort.by("fechaApertura").descending());
        Page<Cuenta> resultado = repository.findByClienteId(clienteId, solicitud);
        return new PaginaCuentasDto(
                resultado.getContent().stream().map(CuentaService::aDto).toList(),
                resultado.getNumber(),
                resultado.getSize(),
                resultado.getTotalElements(),
                resultado.getTotalPages());
    }

    public CuentaDto obtener(String clienteId, UUID id) {
        exigirCliente(clienteId);
        return repository.findByIdAndClienteId(id, clienteId)
                .map(CuentaService::aDto)
                .orElseThrow(() -> new CuentaNoEncontradaException(id));
    }

    static String enmascarar(String numero) {
        if (numero == null || numero.length() <= DIGITOS_VISIBLES) {
            return MASCARA;
        }
        return MASCARA + numero.substring(numero.length() - DIGITOS_VISIBLES);
    }

    private static CuentaDto aDto(Cuenta c) {
        return new CuentaDto(c.getId(), enmascarar(c.getNumero()), c.getTipo(), c.getMoneda(),
                c.getSaldo(), c.getEstado(), c.getFechaApertura());
    }

    private static void exigirCliente(String clienteId) {
        if (clienteId == null || clienteId.isBlank()) {
            throw new IllegalArgumentException("El identificador de cliente es obligatorio");
        }
    }
}
