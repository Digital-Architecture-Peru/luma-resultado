package com.banco.ib.payments.domain;

import java.time.Instant;

/** Criterios validados de consulta. {@code from} inclusivo, {@code toExclusive} exclusivo; nulos = sin filtro. */
public record PaymentQuery(
        String customerId,
        Instant from,
        Instant toExclusive,
        PaymentStatus status,
        int page,
        int size) {

    public int offset() {
        return page * size;
    }
}
