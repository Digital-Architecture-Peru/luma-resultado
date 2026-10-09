package com.banco.accounts.service;

public class AccountNotFoundException extends RuntimeException {

    public AccountNotFoundException(long id) {
        super("Cuenta no encontrada: " + id);
    }
}
