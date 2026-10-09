package com.demo.tarjetas.transaccion.domain;

import java.math.BigDecimal;

/** Puerto hacia el procesador de tarjetas (integracion aun sin definir). */
@FunctionalInterface
public interface ProcesadorTarjetasGateway {

    EstadoTransaccion autorizar(TarjetaInfo tarjeta, BigDecimal monto, String moneda);
}
