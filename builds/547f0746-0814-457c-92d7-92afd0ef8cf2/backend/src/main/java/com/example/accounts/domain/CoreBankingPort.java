package com.example.accounts.domain;

/** Puerto hacia el core bancario (integración sin definir). */
public interface CoreBankingPort {

    /** @return true si el core autoriza la operación. */
    boolean authorize(TransferCommand command);
}
