package com.banco.cards.security;

public class MissingCustomerException extends RuntimeException {
    public MissingCustomerException(String message) {
        super(message);
    }
}
