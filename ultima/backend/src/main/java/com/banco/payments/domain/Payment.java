package com.banco.payments.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

/** Pago inmutable; las transiciones de estado devuelven una nueva instancia. */
public record Payment(
        UUID id,
        String originAccount,
        String beneficiary,
        BigDecimal amount,
        String currency,
        String concept,
        PaymentStatus status,
        String idempotencyKey,
        Instant createdAt) {

    public static final Set<String> ALLOWED_CURRENCIES = Set.of("PEN", "USD");
    private static final Pattern ACCOUNT = Pattern.compile("^[0-9]{10,20}$");
    private static final int MAX_TEXT = 100;
    private static final int MAX_CONCEPT = 140;
    private static final int MAX_KEY = 64;

    /** Crea un pago PENDIENTE validando las reglas de dominio. */
    public static Payment create(String originAccount, String beneficiary, BigDecimal amount,
                                 String currency, String concept, String idempotencyKey,
                                 BigDecimal maxAmount, Instant now) {
        requireText(beneficiary, "beneficiary", MAX_TEXT);
        requireText(concept, "concept", MAX_CONCEPT);
        if (originAccount == null || !ACCOUNT.matcher(originAccount).matches()) {
            throw new InvalidPaymentException("La cuenta de origen debe tener entre 10 y 20 digitos");
        }
        if (currency == null || !ALLOWED_CURRENCIES.contains(currency)) {
            throw new InvalidPaymentException("Moneda no soportada: " + currency);
        }
        validateAmount(amount, maxAmount);
        if (idempotencyKey != null && (idempotencyKey.isBlank() || idempotencyKey.length() > MAX_KEY)) {
            throw new InvalidPaymentException("Idempotency-Key invalida");
        }
        return new Payment(UUID.randomUUID(), originAccount, beneficiary.trim(), amount, currency,
                concept.trim(), PaymentStatus.PENDIENTE, idempotencyKey, now);
    }

    public Payment confirm() {
        return transitionTo(PaymentStatus.CONFIRMADO);
    }

    public Payment reject() {
        return transitionTo(PaymentStatus.RECHAZADO);
    }

    /** Cuenta enmascarada para logs: solo los ultimos 4 digitos. */
    public String maskedOriginAccount() {
        int visible = Math.min(4, originAccount.length());
        return "*".repeat(originAccount.length() - visible)
                + originAccount.substring(originAccount.length() - visible);
    }

    private Payment transitionTo(PaymentStatus target) {
        if (status != PaymentStatus.PENDIENTE) {
            throw new InvalidPaymentException("Transicion invalida: " + status + " -> " + target);
        }
        return new Payment(id, originAccount, beneficiary, amount, currency, concept, target,
                idempotencyKey, createdAt);
    }

    private static void validateAmount(BigDecimal amount, BigDecimal maxAmount) {
        if (amount == null || amount.signum() <= 0) {
            throw new InvalidPaymentException("El importe debe ser mayor que cero");
        }
        if (amount.scale() > 2) {
            throw new InvalidPaymentException("El importe admite como maximo 2 decimales");
        }
        if (amount.compareTo(maxAmount) > 0) {
            throw new InvalidPaymentException("El importe supera el maximo permitido: " + maxAmount);
        }
    }

    private static void requireText(String value, String field, int max) {
        if (value == null || value.isBlank()) {
            throw new InvalidPaymentException("El campo " + field + " es obligatorio");
        }
        if (value.trim().length() > max) {
            throw new InvalidPaymentException("El campo " + field + " supera " + max + " caracteres");
        }
    }
}
