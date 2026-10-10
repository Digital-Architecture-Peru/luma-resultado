package com.example.cuentas.notificaciones.api.dto;

import com.example.cuentas.notificaciones.domain.Canal;
import com.example.cuentas.notificaciones.domain.Preferencia;
import com.example.cuentas.notificaciones.domain.TipoEvento;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record PreferenciaDto(
        @NotNull TipoEvento tipo,
        @NotNull Canal canal,
        @NotNull Boolean activo,
        @PositiveOrZero BigDecimal umbralMonto) {

    public static PreferenciaDto desde(Preferencia p) {
        return new PreferenciaDto(p.tipo(), p.canal(), p.activo(), p.umbralMonto());
    }

    public Preferencia aDominio(String cuentaId) {
        return new Preferencia(cuentaId, tipo, canal, activo, umbralMonto);
    }
}
