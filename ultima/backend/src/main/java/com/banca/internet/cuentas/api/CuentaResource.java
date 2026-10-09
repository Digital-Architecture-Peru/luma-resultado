package com.banca.internet.cuentas.api;

import java.util.List;

import com.banca.internet.cuentas.service.CuentaService;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v1/cuentas")
@Produces(MediaType.APPLICATION_JSON)
public class CuentaResource {

    private final CuentaService servicio;

    public CuentaResource(CuentaService servicio) {
        this.servicio = servicio;
    }

    @GET
    public List<CuentaDto> listar(@HeaderParam(ClienteIdHeader.NOMBRE) String clienteId) {
        return servicio.listar(ClienteIdHeader.parsear(clienteId)).stream()
                .map(CuentaDto::desde)
                .toList();
    }

    @GET
    @Path("/{id}")
    public CuentaDto obtener(@HeaderParam(ClienteIdHeader.NOMBRE) String clienteId,
                             @PathParam("id") long id) {
        return CuentaDto.desde(servicio.obtener(ClienteIdHeader.parsear(clienteId), id));
    }
}
