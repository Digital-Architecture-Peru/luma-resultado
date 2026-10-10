package com.example.cuentas.notificaciones.api.dto;

import com.example.cuentas.notificaciones.domain.AccountMask;
import com.example.cuentas.notificaciones.domain.Preference;
import java.math.BigDecimal;
import java.time.Instant;

public record PreferenceResponse(
        String account,
        BigDecimal lowBalanceThreshold,
        boolean depositEnabled,
        boolean withdrawalEnabled,
        Instant updatedAt) {

    public static PreferenceResponse from(Preference p) {
        return new PreferenceResponse(AccountMask.mask(p.accountId()), p.lowBalanceThreshold(),
                p.depositEnabled(), p.withdrawalEnabled(), p.updatedAt());
    }
}
