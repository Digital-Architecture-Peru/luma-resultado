package com.banco.pagos.domain;

/** Puerto hacia la pasarela de pagos (integración sin definir: hoy lo implementa un stub). */
public interface PasarelaPagoPort {

    ResultadoPasarela autorizar(Pago pago);

    record ResultadoPasarela(boolean autorizado, String motivo) {
        public static ResultadoPasarela aprobado() {
            return new ResultadoPasarela(true, "OK");
        }

        public static ResultadoPasarela rechazado(String motivo) {
            return new ResultadoPasarela(false, motivo);
        }
    }
}
