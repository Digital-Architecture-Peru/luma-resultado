package com.banco.payments.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PaymentRequest(
        @NotBlank String originAccount,
        @NotBlank String beneficiary,
        @NotNull BigDecimal amount,
        @NotBlank String currency,
        @NotBlank String concept) {
}
