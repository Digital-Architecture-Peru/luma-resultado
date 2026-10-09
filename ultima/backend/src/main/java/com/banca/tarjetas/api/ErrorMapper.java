package com.banca.tarjetas.api;

import com.banca.tarjetas.domain.ErrorNegocio;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class ErrorMapper implements ExceptionMapper<ErrorNegocio> {

    @Override
    public Response toResponse(ErrorNegocio e) {
        return Response.status(e.estadoHttp())
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorDto(e.codigo(), e.getMessage()))
                .build();
    }
}
