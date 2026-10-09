-- Notificaciones in-app de tarjetas. Solo se guardan los últimos 4 dígitos (nunca el PAN).
CREATE TABLE notificacion (
    id          BIGSERIAL PRIMARY KEY,
    tarjeta_id  VARCHAR(36)  NOT NULL,
    ultimos4    CHAR(4)      NOT NULL CHECK (ultimos4 ~ '^[0-9]{4}$'),
    tipo        VARCHAR(20)  NOT NULL
                CHECK (tipo IN ('CONSUMO', 'VENCIMIENTO', 'BLOQUEO', 'PAGO_RECIBIDO')),
    mensaje     VARCHAR(280) NOT NULL,
    leida       BOOLEAN      NOT NULL DEFAULT FALSE,
    creada_en   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Listado paginado por tarjeta, más reciente primero.
CREATE INDEX idx_notificacion_tarjeta_creada
    ON notificacion (tarjeta_id, creada_en DESC);

-- Consulta de no leídas (subconjunto pequeño).
CREATE INDEX idx_notificacion_no_leidas
    ON notificacion (tarjeta_id, creada_en DESC)
    WHERE leida = FALSE;
