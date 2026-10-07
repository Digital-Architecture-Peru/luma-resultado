package com.banco.tarjetas.molecules;

import com.banco.tarjetas.atoms.EnmascaradorNumero;
import com.banco.tarjetas.atoms.TipoTarjeta;
import com.banco.tarjetas.dto.TarjetaDetalle;
import com.banco.tarjetas.dto.TarjetaResumen;
import com.banco.tarjetas.model.Tarjeta;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/** Molecule: combina atoms para convertir dominio en DTOs seguros. */
@Component
public class TarjetaMapper {

    public TarjetaResumen aResumen(Tarjeta t) {
        return new TarjetaResumen(
                t.id(),
                EnmascaradorNumero.enmascarar(t.numero()),
                t.tipo().name(),
                t.estado().name());
    }

    public TarjetaDetalle aDetalle(Tarjeta t) {
        return new TarjetaDetalle(
                t.id(),
                EnmascaradorNumero.enmascarar(t.numero()),
                t.titular(),
                t.tipo().name(),
                t.estado().name(),
                t.moneda(),
                t.limite(),
                t.saldo(),
                calcularDisponible(t),
                t.vencimiento().toString());
    }

    /** Crédito: límite - saldo utilizado. Débito: el saldo es el disponible. */
    private BigDecimal calcularDisponible(Tarjeta t) {
        if (t.tipo() == TipoTarjeta.CREDITO) {
            return t.limite().subtract(t.saldo());
        }
        return t.saldo();
    }
}
