package com.example.tarjetas.notificaciones.port;

public class RepositorioException extends RuntimeException {

    public RepositorioException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
