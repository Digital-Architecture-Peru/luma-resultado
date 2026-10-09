package com.banca.tarjetas.service;

import com.banca.tarjetas.domain.ErrorNegocio;
import com.banca.tarjetas.domain.Tarjeta;
import com.banca.tarjetas.repository.TarjetaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class TarjetaService {

    public static final int TAMANO_MAXIMO = 50;

    /** Página de resultados del dominio. */
    public record Pagina(List<Tarjeta> items, int pagina, int tamano, long total) {
    }

    private final TarjetaRepository repositorio;

    public TarjetaService(TarjetaRepository repositorio) {
        this.repositorio = repositorio;
    }

    public Pagina listar(UUID clienteId, int pagina, int tamano) {
        if (pagina < 0) {
            throw ErrorNegocio.solicitudInvalida("pagina debe ser >= 0");
        }
        if (tamano < 1 || tamano > TAMANO_MAXIMO) {
            throw ErrorNegocio.solicitudInvalida("tamano debe estar entre 1 y " + TAMANO_MAXIMO);
        }
        List<Tarjeta> items = repositorio.listarPorCliente(clienteId, pagina, tamano);
        return new Pagina(items, pagina, tamano, repositorio.contarPorCliente(clienteId));
    }

    /** Devuelve 404 tanto si no existe como si pertenece a otro cliente. */
    public Tarjeta obtener(UUID id, UUID clienteId) {
        return repositorio.buscarPorIdYCliente(id, clienteId).orElseThrow(ErrorNegocio::tarjetaNoEncontrada);
    }
}
