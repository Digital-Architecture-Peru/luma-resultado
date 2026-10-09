package com.banca.tarjetas.api;

import com.banca.tarjetas.api.dto.TarjetaDetalleDto;
import com.banca.tarjetas.api.dto.TarjetaResumenDto;
import com.banca.tarjetas.application.ConsultaTarjetasService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import java.util.UUID;

/**
 * Consulta de solo lectura. X-Cliente-Id es un sustituto temporal de la identidad:
 * en producción debe derivarse del token de sesión.
 */
@Path("/api/v1/tarjetas")
@Produces(MediaType.APPLICATION_JSON)
public class TarjetaResource {

    static final String CABECERA_CLIENTE = "X-Cliente-Id";

    private final ConsultaTarjetasService servicio;

    public TarjetaResource(ConsultaTarjetasService servicio) {
        this.servicio = servicio;
    }

    @GET
    public List<TarjetaResumenDto> listar(@HeaderParam(CABECERA_CLIENTE) String cliente) {
        return servicio.listar(parsearCliente(cliente)).stream()
                .map(TarjetaResumenDto::desde)
                .toList();
    }

    @GET
    @Path("/{id}")
    public TarjetaDetalleDto detalle(@HeaderParam(CABECERA_CLIENTE) String cliente,
                                     @PathParam("id") String id) {
        UUID clienteId = parsearCliente(cliente);
        return TarjetaDetalleDto.desde(servicio.detalle(clienteId, UUID.fromString(id)));
    }

    static UUID parsearCliente(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new ClienteInvalidoException("Falta la cabecera " + CABECERA_CLIENTE);
        }
        try {
            return UUID.fromString(valor.trim());
        } catch (IllegalArgumentException e) {
            throw new ClienteInvalidoException("La cabecera " + CABECERA_CLIENTE + " no es un UUID válido");
        }
    }
}
