package com.banca.tarjetas.api;

import com.banca.tarjetas.domain.ErrorNegocio;
import com.banca.tarjetas.service.TarjetaService;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.UUID;

/**
 * Consulta de tarjetas (solo lectura).
 * La identidad llega en X-Cliente-Id: SIMULACIÓN para candidate, no apta para producción
 * (debe reemplazarse por el token validado del gateway/OIDC).
 */
@Path("/api/v1/tarjetas")
@Produces(MediaType.APPLICATION_JSON)
public class TarjetaResource {

    private final TarjetaService servicio;

    public TarjetaResource(TarjetaService servicio) {
        this.servicio = servicio;
    }

    @GET
    public PaginaDto<TarjetaDto> listar(
            @HeaderParam("X-Cliente-Id") String cliente,
            @QueryParam("pagina") @DefaultValue("0") int pagina,
            @QueryParam("tamano") @DefaultValue("20") int tamano) {
        TarjetaService.Pagina p = servicio.listar(parsearUuid(cliente, "X-Cliente-Id"), pagina, tamano);
        return new PaginaDto<>(p.items().stream().map(TarjetaDto::desde).toList(), p.pagina(), p.tamano(), p.total());
    }

    @GET
    @Path("/{id}")
    public TarjetaDto obtener(@HeaderParam("X-Cliente-Id") String cliente, @PathParam("id") String id) {
        return TarjetaDto.desde(servicio.obtener(parsearUuid(id, "id"), parsearUuid(cliente, "X-Cliente-Id")));
    }

    private static UUID parsearUuid(String valor, String campo) {
        if (valor == null || valor.isBlank()) {
            throw ErrorNegocio.solicitudInvalida(campo + " es obligatorio");
        }
        try {
            return UUID.fromString(valor);
        } catch (IllegalArgumentException e) {
            throw ErrorNegocio.solicitudInvalida(campo + " no es un UUID válido");
        }
    }
}
