package com.example.accounts.api;

import com.example.accounts.domain.TransferCommand;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record TransferRequest(
        @NotNull Long sourceAccountId,
        @NotNull Long targetAccountId,
        @NotBlank @Pattern(regexp = "^\\d{1,17}(\\.\\d{1,2})?$", message = "monto inválido") String amount,
        @NotBlank @Size(min = 3, max = 3) String currency,
        @Size(max = 140) String description) {

    public TransferCommand toCommand() {
        return new TransferCommand(sourceAccountId, targetAccountId, new BigDecimal(amount), currency, description);
    }
}
