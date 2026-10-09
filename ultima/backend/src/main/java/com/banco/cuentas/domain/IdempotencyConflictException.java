package com.banco.cuentas.domain;

public class IdempotencyConflictException extends DomainException {
    public IdempotencyConflictException() {
        super(409, "idempotency-conflict",
                "La clave de idempotencia ya se usó con una solicitud distinta.");
    }
}
