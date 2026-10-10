package com.example.cuentas.notificaciones.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PreferenceRequest(
        @NotNull @DecimalMin("0.00") BigDecimal lowBalanceThreshold,
        @NotNull Boolean depositEnabled,
        @NotNull Boolean withdrawalEnabled) {
}
