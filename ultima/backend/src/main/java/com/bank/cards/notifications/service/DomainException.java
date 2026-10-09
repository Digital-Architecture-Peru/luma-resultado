package com.bank.cards.notifications.service;

import java.util.UUID;

/** Error de negocio con el código HTTP que le corresponde; el mapeo a respuesta vive en la capa api. */
public abstract class DomainException extends RuntimeException {

    private final int status;
    private final String title;

    protected DomainException(int status, String title, String message) {
        super(message);
        this.status = status;
        this.title = title;
    }

    public int status() {
        return status;
    }

    public String title() {
        return title;
    }

    /** 400: la petición no cumple el contrato. */
    public static final class InvalidRequest extends DomainException {
        public InvalidRequest(String message) {
            super(400, "Petición inválida", message);
        }
    }

    /** 401: falta la identidad del cliente. */
    public static final class Unauthenticated extends DomainException {
        public Unauthenticated() {
            super(401, "No autenticado", "Falta la identidad del cliente.");
        }
    }

    /** 403: la tarjeta no pertenece al cliente. */
    public static final class AccessDenied extends DomainException {
        public AccessDenied() {
            super(403, "Acceso denegado", "No tienes acceso a esta tarjeta.");
        }
    }

    /** 404: la notificación no existe o no es del cliente (no se distingue para no filtrar información). */
    public static final class NotFound extends DomainException {
        public NotFound(UUID id) {
            super(404, "No encontrado", "No existe la notificación " + id + ".");
        }
    }
}
