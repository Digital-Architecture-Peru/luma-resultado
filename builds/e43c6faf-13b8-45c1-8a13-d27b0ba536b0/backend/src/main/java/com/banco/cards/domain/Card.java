package com.banco.cards.domain;

import com.banco.cards.domain.Errors.BusinessRuleException;
import java.math.BigDecimal;
import java.util.UUID;

/** Tarjeta con PAN enmascarado; nunca se maneja el número completo. */
public record Card(UUID id, String maskedPan, CardStatus status, BigDecimal creditLimit,
                   BigDecimal availableBalance, long version) {

    public enum CardStatus { ACTIVE, BLOCKED, EXPIRED }

    public boolean isActive() {
        return status == CardStatus.ACTIVE;
    }

    /** Devuelve la tarjeta con el saldo recalculado; no muta la instancia actual. */
    public Card apply(TransactionType type, BigDecimal amount) {
        BigDecimal newBalance = type.consumesBalance()
                ? availableBalance.subtract(amount)
                : availableBalance.add(amount);
        if (newBalance.signum() < 0) {
            throw new BusinessRuleException("Saldo disponible insuficiente");
        }
        if (newBalance.compareTo(creditLimit) > 0) {
            throw new BusinessRuleException("El monto excede el límite de la tarjeta");
        }
        return new Card(id, maskedPan, status, creditLimit, newBalance, version + 1);
    }
}
