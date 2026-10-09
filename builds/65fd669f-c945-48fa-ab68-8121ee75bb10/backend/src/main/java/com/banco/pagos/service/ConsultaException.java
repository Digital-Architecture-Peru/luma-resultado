package com.banco.pagos.service;

/** Error del dominio de consulta con el codigo HTTP que le corresponde. */
public class ConsultaException extends RuntimeException {

    private final int status;
    private final String title;

    public ConsultaException(int status, String title, String detail) {
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

    public static ConsultaException parametroInvalido(String detail) {
        return new ConsultaException(400, "Parametro invalido", detail);
    }

    public static ConsultaException noEncontrado(String detail) {
        return new ConsultaException(404, "Pago no encontrado", detail);
    }
}
