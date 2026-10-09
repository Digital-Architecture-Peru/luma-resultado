package com.demo.tarjetas.transaccion.api;

import com.demo.tarjetas.transaccion.domain.TarjetaInfo;

/** Solo datos enmascarados de la tarjeta. */
public record TarjetaRespuesta(long id, String ultimos4, String tipo, String estado) {

    public static TarjetaRespuesta de(TarjetaInfo t) {
        return new TarjetaRespuesta(t.id(), t.ultimos4(), t.tipo(), t.estado());
    }
}
