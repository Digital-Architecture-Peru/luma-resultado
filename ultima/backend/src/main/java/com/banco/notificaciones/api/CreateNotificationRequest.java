package com.banco.notificaciones.api;

import com.banco.notificaciones.domain.NotificationType;
import com.banco.notificaciones.service.NewNotification;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CreateNotificationRequest(
        @NotBlank @Size(max = 64) String paymentId,
        @NotNull NotificationType type,
        @NotBlank @Size(max = 120) String title,
        @NotBlank @Size(max = 500) String message,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotNull @Pattern(regexp = "[A-Z]{3}") String currency,
        @NotNull @Pattern(regexp = "\\d{4}") String accountLast4) {

    public NewNotification toDomain() {
        return new NewNotification(paymentId, type, title, message, amount, currency, accountLast4);
    }
}
