package com.banca.pagos.notification.service;

import com.banca.pagos.notification.domain.NotificationType;
import java.util.UUID;

/** Error del dominio con código estable y estado HTTP asociado. */
public class NotificationException extends RuntimeException {

    public enum Code {
        NOT_FOUND(404),
        DUPLICATE(409),
        INVALID_REQUEST(400);

        private final int httpStatus;

        Code(int httpStatus) {
            this.httpStatus = httpStatus;
        }

        public int httpStatus() {
            return httpStatus;
        }
    }

    private final Code code;

    private NotificationException(Code code, String message) {
        super(message);
        this.code = code;
    }

    public Code code() {
        return code;
    }

    public static NotificationException notFound(UUID id) {
        return new NotificationException(Code.NOT_FOUND, "Notificación no encontrada: " + id);
    }

    public static NotificationException duplicate(String paymentReference, NotificationType type) {
        return new NotificationException(Code.DUPLICATE,
                "Ya existe una notificación " + type + " para el pago " + paymentReference);
    }

    public static NotificationException invalid(String message) {
        return new NotificationException(Code.INVALID_REQUEST, message);
    }
}
