package com.banca.tarjetas.domain;

/** Error controlado del dominio con código estable y estado HTTP asociado. */
public class ErrorNegocio extends RuntimeException {

    private final int estadoHttp;
    private final String codigo;

    public ErrorNegocio(int estadoHttp, String codigo, String mensaje) {
        super(mensaje);
        this.estadoHttp = estadoHttp;
        this.codigo = codigo;
    }

    public int estadoHttp() {
        return estadoHttp;
    }

    public String codigo() {
        return codigo;
    }

    public static ErrorNegocio solicitudInvalida(String mensaje) {
        return new ErrorNegocio(400, "SOLICITUD_INVALIDA", mensaje);
    }

    public static ErrorNegocio tarjetaNoEncontrada() {
        return new ErrorNegocio(404, "TARJETA_NO_ENCONTRADA", "La tarjeta no existe");
    }
}
