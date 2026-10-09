package com.banco.cards.domain;

/** Error del dominio con el estado HTTP que le corresponde en el contrato. */
public abstract class DomainException extends RuntimeException {

    private final int status;
    private final String title;

    protected DomainException(int status, String title, String detail) {
        super(detail);
        this.status = status;
        this.title = title;
    }

    public int status() {
        return status;
    }

    public String title() {
        return title;
    }
}
