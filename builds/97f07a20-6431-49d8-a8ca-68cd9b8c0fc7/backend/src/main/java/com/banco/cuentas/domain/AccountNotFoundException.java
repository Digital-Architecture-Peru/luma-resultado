package com.banco.cuentas.domain;

public class AccountNotFoundException extends DomainException {
    public AccountNotFoundException(String detail) {
        super(404, "account-not-found", detail);
    }
}
