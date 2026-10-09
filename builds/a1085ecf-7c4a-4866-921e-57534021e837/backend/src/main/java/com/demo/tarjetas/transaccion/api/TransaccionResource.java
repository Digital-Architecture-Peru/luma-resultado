package com.demo.tarjetas.transaccion.api;

import com.demo.tarjetas.transaccion.application.RegistrarTransaccionService;
import com.demo.tarjetas.transaccion.application.ResultadoRegistro;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * Capa de entrada. {@code X-Cliente-Id} simula el cliente ya autenticado por Banca por Internet (H2).
 */
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
public class TransaccionResource {

    private final RegistrarTransaccionService servicio;

    @Inject
    public TransaccionResource(RegistrarTransaccionService servicio) {
        this.servicio = servicio;
    }

    @GET
    @Path("/tarjetas")
    public List<TarjetaRespuesta> tarjetas(@HeaderParam("X-Cliente-Id") String clienteId) {
        return servicio.tarjetas(exigirCliente(clienteId)).stream().map(TarjetaRespuesta::de).toList();
    }

    @POST
    @Path("/tarjetas/{id}/transacciones")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registrar(@PathParam("id") long tarjetaId,
                              @HeaderParam("X-Cliente-Id") String clienteId,
                              @HeaderParam("Idempotency-Key") String idempotencyKey,
                              SolicitudTransaccion solicitud) {
        if (solicitud == null) {
            throw new BadRequestException("Cuerpo requerido");
        }
        ResultadoRegistro r = servicio.registrar(exigirCliente(clienteId), tarjetaId,
                solicitud.monto(), solicitud.moneda(), idempotencyKey);
        int status = r.repetida() ? Response.Status.OK.getStatusCode() : Response.Status.CREATED.getStatusCode();
        return Response.status(status).entity(TransaccionRespuesta.de(r.transaccion())).build();
    }

    @GET
    @Path("/tarjetas/{id}/transacciones")
    public List<TransaccionRespuesta> historial(@PathParam("id") long tarjetaId,
                                                @HeaderParam("X-Cliente-Id") String clienteId,
                                                @QueryParam("limite") @DefaultValue("20") int limite) {
        return servicio.historial(exigirCliente(clienteId), tarjetaId, limite).stream()
                .map(TransaccionRespuesta::de).toList();
    }

    private static String exigirCliente(String clienteId) {
        if (clienteId == null || clienteId.isBlank()) {
            throw new BadRequestException("Cabecera X-Cliente-Id requerida");
        }
        return clienteId;
    }
}
