package com.banco.pagos.api;

import com.banco.pagos.application.ConsultarPagoUseCase;
import com.banco.pagos.application.RegistrarPagoUseCase;
import com.banco.pagos.application.RegistrarPagoUseCase.Comando;
import com.banco.pagos.application.RegistrarPagoUseCase.Resultado;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/pagos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PagoResource {

    private final RegistrarPagoUseCase registrar;
    private final ConsultarPagoUseCase consultar;

    public PagoResource(RegistrarPagoUseCase registrar, ConsultarPagoUseCase consultar) {
        this.registrar = registrar;
        this.consultar = consultar;
    }

    @POST
    public Response crear(@HeaderParam("Idempotency-Key") String idempotencyKey, @Valid PagoRequest solicitud) {
        Resultado resultado = registrar.ejecutar(new Comando(idempotencyKey, solicitud.cuentaOrigen(),
                solicitud.cuentaDestino(), solicitud.monto(), solicitud.moneda()));
        PagoResponse cuerpo = PagoResponse.desde(resultado.pago());
        if (resultado.creado()) {
            return Response.created(URI.create("/api/v1/pagos/" + cuerpo.id())).entity(cuerpo).build();
        }
        return Response.ok(cuerpo).build();
    }

    @GET
    @Path("/{id}")
    public PagoResponse obtener(@PathParam("id") UUID id) {
        return PagoResponse.desde(consultar.porId(id));
    }

    @GET
    public List<PagoResponse> listar(@QueryParam("cuentaOrigen") String cuentaOrigen) {
        return consultar.porCuentaOrigen(cuentaOrigen).stream().map(PagoResponse::desde).toList();
    }
}
