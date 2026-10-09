package com.banco.payments.adapter.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;

public record CreatePaymentRequest(
        @NotNull(message = "sourceAccountId es obligatorio")
        UUID sourceAccountId,

        @NotNull(message = "targetAccount es obligatorio")
        @Pattern(regexp = "[A-Za-z0-9-]{6,34}", message = "targetAccount debe tener 6 a 34 caracteres alfanumericos")
        String targetAccount,

        @NotNull(message = "amount es obligatorio")
        @DecimalMin(value = "0.01", message = "amount debe ser mayor a 0")
        @Digits(integer = 17, fraction = 2, message = "amount admite hasta 2 decimales")
        BigDecimal amount,

        @NotNull(message = "currency es obligatoria")
        @Pattern(regexp = "[A-Z]{3}", message = "currency debe ser un codigo ISO 4217")
        String currency,

        @Size(max = 140, message = "reference admite hasta 140 caracteres")
        String reference) {
}
