package com.bank.cards.notifications.adapter;

/** Fallo de acceso a datos. El detalle técnico no se expone al cliente. */
public class DataAccessException extends RuntimeException {

    public DataAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
