package com.banco.cuentas.domain;

public class ValidationException extends DomainException {
    public ValidationException(String message) {
        super(422, "validation-error", message);
    }
}
