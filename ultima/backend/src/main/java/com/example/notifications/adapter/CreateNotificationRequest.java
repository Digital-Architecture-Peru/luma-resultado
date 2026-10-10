package com.example.notifications.adapter;

import com.example.notifications.domain.NotificationType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CreateNotificationRequest(
        @NotBlank @Size(max = 60) String paymentReference,
        @NotNull NotificationType type,
        @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
        @NotBlank @Pattern(regexp = "[A-Za-z]{3}") String currency,
        @NotBlank @Size(min = 4, max = 34) String account) {
}
