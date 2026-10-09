package com.banco.cuentas.domain;

public class InsufficientFundsException extends DomainException {
    public InsufficientFundsException() {
        super(409, "insufficient-funds", "El saldo de la cuenta origen es insuficiente.");
    }
}
