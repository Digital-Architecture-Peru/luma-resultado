package com.banca.pagos.notification.api.dto;

import com.banca.pagos.notification.domain.NotificationStatus;
import com.banca.pagos.notification.domain.NotificationType;
import com.banca.pagos.notification.domain.PaymentNotification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class PaymentNotificationDtos {

    private PaymentNotificationDtos() {
    }

    public record CreateRequest(
            @NotBlank @Size(max = 40) String paymentReference,
            @NotNull NotificationType type,
            @NotBlank @Size(max = 34) String accountNumber,
            @NotNull @Positive BigDecimal amount,
            @NotBlank @Pattern(regexp = "[A-Z]{3}") String currency) {
    }

    public record NotificationResponse(
            UUID id,
            String paymentReference,
            NotificationType type,
            NotificationStatus status,
            String title,
            String message,
            BigDecimal amount,
            String currency,
            Instant createdAt,
            Instant readAt) {

        public static NotificationResponse from(PaymentNotification n) {
            return new NotificationResponse(n.id(), n.paymentReference(), n.type(), n.status(), n.title(),
                    n.message(), n.amount(), n.currency(), n.createdAt(), n.readAt());
        }
    }

    public record PageResponse(List<NotificationResponse> items, long total) {
    }

    public record ErrorBody(String code, String message) {
    }
}
