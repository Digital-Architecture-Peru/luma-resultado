package com.example.payments.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreatePaymentRequest(
        @NotBlank @Size(max = 34) String sourceAccount,
        @NotBlank @Size(max = 34) String beneficiary,
        @NotBlank @Pattern(regexp = "^\\d{1,17}(\\.\\d{1,2})?$", message = "formato de importe invalido") String amount,
        @NotBlank @Pattern(regexp = "^[A-Z]{3}$", message = "moneda invalida") String currency,
        @Size(max = 140) String reference) {
}
