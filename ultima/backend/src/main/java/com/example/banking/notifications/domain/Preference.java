package com.example.banking.notifications.domain;

import java.math.BigDecimal;
import java.util.Objects;

public record Preference(
        String accountId,
        NotificationType type,
        Channel channel,
        boolean enabled,
        BigDecimal thresholdAmount) {

    public Preference {
        Objects.requireNonNull(type, "type");
        Objects.requireNonNull(channel, "channel");
        if (accountId == null || accountId.isBlank()) {
            throw new DomainException.InvalidRequest("accountId es obligatorio");
        }
        if (thresholdAmount != null && thresholdAmount.signum() < 0) {
            throw new DomainException.InvalidRequest("thresholdAmount no puede ser negativo");
        }
    }
}
