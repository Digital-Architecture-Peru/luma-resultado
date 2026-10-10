package com.banca.notificaciones.notification.domain;

import java.io.Serializable;
import java.util.Objects;

/** Clave compuesta (account_id, type) de la preferencia. */
public class PreferenceId implements Serializable {

    private String accountId;
    private NotificationType type;

    public PreferenceId() {
        // requerido por JPA
    }

    public PreferenceId(String accountId, NotificationType type) {
        this.accountId = accountId;
        this.type = type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PreferenceId other)) {
            return false;
        }
        return Objects.equals(accountId, other.accountId) && type == other.type;
    }

    @Override
    public int hashCode() {
        return Objects.hash(accountId, type);
    }
}
