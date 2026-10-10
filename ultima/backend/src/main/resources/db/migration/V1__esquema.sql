CREATE TABLE notificacion (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cuenta_id  VARCHAR(20)    NOT NULL,
    tipo       VARCHAR(20)    NOT NULL CHECK (tipo IN ('ABONO', 'CARGO', 'SALDO_BAJO')),
    mensaje    VARCHAR(255)   NOT NULL,
    monto      NUMERIC(18, 2) CHECK (monto IS NULL OR monto >= 0),
    leida      BOOLEAN        NOT NULL DEFAULT FALSE,
    creada_en  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_notificacion_cuenta_leida_fecha
    ON notificacion (cuenta_id, leida, creada_en DESC);

CREATE TABLE preferencia_notificacion (
    cuenta_id    VARCHAR(20)    NOT NULL,
    tipo         VARCHAR(20)    NOT NULL CHECK (tipo IN ('ABONO', 'CARGO', 'SALDO_BAJO')),
    canal        VARCHAR(10)    NOT NULL CHECK (canal IN ('EMAIL', 'SMS', 'APP')),
    activo       BOOLEAN        NOT NULL DEFAULT TRUE,
    umbral_monto NUMERIC(18, 2) CHECK (umbral_monto IS NULL OR umbral_monto >= 0),
    PRIMARY KEY (cuenta_id, tipo, canal)
);
