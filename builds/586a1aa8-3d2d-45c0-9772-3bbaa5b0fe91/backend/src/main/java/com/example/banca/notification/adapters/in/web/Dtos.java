package com.example.banca.notification.adapters.in.web;

import com.example.banca.notification.domain.Channel;
import com.example.banca.notification.domain.EventType;
import com.example.banca.notification.domain.NotificationStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** DTOs de la API web; separados del dominio. */
public final class Dtos {

    private Dtos() {
    }

    public record NotificationDto(UUID id, String paymentId, EventType eventType, BigDecimal amount,
                                  String currency, String maskedAccount, NotificationStatus status,
                                  Instant createdAt, Instant readAt) {
    }

    public record PageDto<T>(List<T> items, int page, int size, long totalElements) {
    }

    public record PreferenceDto(@NotNull EventType eventType, @NotNull Channel channel,
                                @NotNull Boolean enabled) {
    }

    public record PreferencesUpdate(@NotEmpty @Valid List<PreferenceDto> preferences) {
    }

    public record PaymentEventRequest(
            @NotBlank @Size(max = 40) String customerId,
            @NotBlank @Size(max = 40) String paymentId,
            @NotNull EventType eventType,
            @NotNull @DecimalMin("0.00") BigDecimal amount,
            @NotBlank @Pattern(regexp = "[A-Z]{3}") String currency,
            @NotBlank @Size(max = 34) String accountNumber) {
    }
}
