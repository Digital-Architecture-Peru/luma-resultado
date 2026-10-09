package com.banco.pagos.api;

import com.banco.pagos.service.ConsultaPagos;
import com.banco.pagos.service.ConsultaPagosService;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v1/pagos")
@Produces(MediaType.APPLICATION_JSON)
public class PagoResource {

    private final ConsultaPagosService servicio;

    public PagoResource(ConsultaPagosService servicio) {
        this.servicio = servicio;
    }

    @GET
    public PaginaDto<PagoDto> listar(
            @QueryParam("cuentaId") String cuentaId,
            @QueryParam("desde") String desde,
            @QueryParam("hasta") String hasta,
            @QueryParam("estado") String estado,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        return servicio.consultar(new ConsultaPagos(cuentaId, desde, hasta, estado, page, size));
    }

    @GET
    @Path("/{id}")
    public PagoDto obtener(@PathParam("id") Long id, @QueryParam("cuentaId") String cuentaId) {
        return servicio.obtener(id, cuentaId);
    }
}
