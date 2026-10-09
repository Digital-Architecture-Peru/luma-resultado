package com.banco.pagos.api;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public record PagoRequest(
        @NotBlank @Pattern(regexp = "^[A-Z0-9-]{8,34}$", message = "formato de cuenta inválido") String cuentaOrigen,
        @NotBlank @Pattern(regexp = "^[A-Z0-9-]{8,34}$", message = "formato de cuenta inválido") String cuentaDestino,
        @NotNull @DecimalMin(value = "0.01", message = "debe ser mayor que cero") BigDecimal monto,
        @NotBlank @Pattern(regexp = "^[A-Z]{3}$", message = "use un código ISO-4217") String moneda) {
}
