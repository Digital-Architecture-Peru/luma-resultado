package com.banco.tarjetas.resource;

import com.banco.tarjetas.model.Tarjeta;
import com.banco.tarjetas.service.TarjetaService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/v1/tarjetas")
@Produces(MediaType.APPLICATION_JSON)
public class TarjetaResource {

    private final TarjetaService servicio;

    public TarjetaResource(TarjetaService servicio) {
        this.servicio = servicio;
    }

    @GET
    public List<Tarjeta> listar(@QueryParam("estado") String estado) {
        return servicio.listar(estado);
    }

    @GET
    @Path("/{id}")
    public Tarjeta obtener(@PathParam("id") String id) {
        return servicio.obtener(id);
    }
}
