CREATE TABLE pago (
    id               UUID          PRIMARY KEY,
    idempotency_key  VARCHAR(64)   NOT NULL,
    cuenta_origen    VARCHAR(34)   NOT NULL,
    cuenta_destino   VARCHAR(34)   NOT NULL,
    monto            NUMERIC(19,2) NOT NULL CHECK (monto > 0),
    moneda           CHAR(3)       NOT NULL,
    estado           VARCHAR(12)   NOT NULL CHECK (estado IN ('PENDIENTE', 'CONFIRMADO', 'RECHAZADO')),
    creado_en        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT uq_pago_idempotency_key UNIQUE (idempotency_key),
    CONSTRAINT ck_pago_cuentas_distintas CHECK (cuenta_origen <> cuenta_destino)
);

CREATE INDEX ix_pago_cuenta_origen_creado ON pago (cuenta_origen, creado_en DESC);
